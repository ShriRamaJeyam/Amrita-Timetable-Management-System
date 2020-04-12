const Sequelize = require('sequelize');
const Globals = require('./globals').Globals;
const sequelize = new Sequelize('ATMS', 'sa', 'NirU26@^', {
    dialect: 'mssql',
    dialectOptions:     
    {
        options: 
        {
            useUTC: false,
            dateFirst: 1,
        },
        host:'localhost',
        pool: {
            max: 50,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
});

const datatypes = {
    generalString : Sequelize.STRING(50)
};

class Settings extends Sequelize.Model {};
class TimeSlots extends Sequelize.Model {};
class TimeSlotGroups extends Sequelize.Model {};
class TimeSlotGroupMembers extends Sequelize.Model {};
class Departments extends Sequelize.Model {};
class Programs extends Sequelize.Model {};
class Semesters extends Sequelize.Model {};

Settings.init({
    SettingID:{
        type : datatypes.generalString,
        primaryKey:true,
    },
    Data:{
        type:Sequelize.DataTypes.TEXT,
        allowNull :false
    }
},{
    sequelize
});

TimeSlots.init({
    starter:{
        type : Sequelize.INTEGER,
        allowNull: false,
        validate :{
            min : 1,
            max : 900
        }
    },
    ender:{
        type : Sequelize.INTEGER,
        allowNull: false,
        validate :{
            min : 1,
            max : 900
        }
    },
    hasBreak:{
        type : Sequelize.BOOLEAN,
        defaultValue : false
    },
    startBreak:{
        type : Sequelize.INTEGER,
        validate :{
            min : 1,
            max : 900
        }
    },
    endBreak:{
        type : Sequelize.INTEGER,
        validate :{
            min : 1,
            max : 900
        }
    }
},{ 
    validate :{
        isValidBreak()
        {
            if(this.hasBreak === true)
            {
                if(this.startBreak === null || this.endBreak === null)
                {
                    throw new Error("Break start and end can't be null if the Timeslot has breaks");
                }
                else if(this.endBreak < this.startBreak)
                {
                    throw new Error("Break cant end before it can start");
                }
                else if(this.startBreak < this.starter || this.endBreak > this.ender )
                {
                    throw new Error("Invalid break time.");
                }
            }
        },
        isTimeSlotValid()
        {
            if( this.ender < this.starter )
            {
                throw new Error("TimeSlot cant end before it can start");
            }
        }
    },
    sequelize 
});

TimeSlotGroups.init({
    TimeSlotGroupName:{
        type : datatypes.generalString,
        allowNull : false
    }
},{
    sequelize
});

TimeSlotGroupMembers.init({
    TimeSlotID:{
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
            model : TimeSlots,
            key : 'id'
        },
        unique : 'NoMultiMap'
    },
    TimeSlotGroupID:{
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
            model : TimeSlotGroups,
            key : 'id'
        },
        unique : 'NoMultiMap'
    }
},{
    sequelize
});

Departments.init({
    DepartmentName:{
        type : datatypes.generalString,
        unique : true,
        allowNull:false
    }
},{
    sequelize
});

Programs.init({
    DepartmentID:{
        type: Sequelize.INTEGER,
        references:{
            model:Departments,
            key:'id'
        },
        unique:'NoDupProgForSameDept',
        allowNull:false
    },
    ProgramName:{
        type:datatypes.generalString,
        unique:'NoDupProgForSameDept',
        allowNull:false
    }
},{sequelize});

Semesters.init({
    ProgramID:{
        type:Sequelize.INTEGER,
        references:{
            model:Programs,
            key:'id'
        },
        unique:"Unique_Semester_For_Department",
        allowNull:false
    },
    SemesterNumber:
    {
        type:Sequelize.INTEGER,
        unique:"Unique_Semester_For_Department",
        allowNull:false
    }
},{
    sequelize
});

sequelize.sync().then(()=>{
    Globals.isDatabaseSynced = true;
});


module.exports = {
    sequelize,
    tables:{
        Settings,
        TimeSlots,
        TimeSlotGroups,
        TimeSlotGroupMembers
    }
};