const Sequelize = require('sequelize');

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

class Settings extends Sequelize.Model {}
class TimeSlot extends Sequelize.Model {}
class TimeSlotGroups extends Sequelize.Model {}
class TimeSlotGroupMembers extends Sequelize.Model {}

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

TimeSlot.init({
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
            model : TimeSlot,
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

sequelize.sync().then(()=>{
    console.log("Synced");
});


module.exports = {
    sequelize,
    tables:{
        Settings,
        TimeSlot
    }
};