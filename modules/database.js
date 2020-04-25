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
class Teachers extends Sequelize.Model {};
class TeacherGroups extends Sequelize.Model {};
class TeacherGroupMembers extends Sequelize.Model {};
class DayLists extends Sequelize.Model {};
class Regions extends Sequelize.Model {};
class Rooms extends Sequelize.Model {};
class RoomGroups extends Sequelize.Model {};
class RoomGroupMembers extends Sequelize.Model {};

Regions.init({
    Region:{
        type:datatypes.generalString,
        allowNull:false,
        unique:true
    }
},{sequelize});

DayLists.init({
    DayName:{
        type:datatypes.generalString,
        allowNull:false,
        unique:true
    }
},{sequelize});

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

Teachers.init({
    TeacherName:{
        type:datatypes.generalString,
        allowNull:false
    },
    DepartmentID:{
        type:Sequelize.INTEGER,
        references:{
            model : Departments,
            key :'id'
        },
        allowNull:false
    },
    PhoneNumber:{
        type:Sequelize.STRING(10),
        allowNull:false,
        unique:true,
        validate:{
            is:Globals.RegEx.PhoneNumber
        }
    },
    EmployeeID:{
        type:Sequelize.STRING(10),
        allowNull:false,
        unique:true,
        validate:{
            is:Globals.RegEx.EmployeeID
        }
    },
    Extn:{
        type:Sequelize.STRING(4),
        allowNull:false,
        unique:true,
        validate:{
            is:Globals.RegEx.EmployeeID
        }
    },
    Password:{
        type:Sequelize.STRING(15),
        allowNull:false,
        validate:{
            is:Globals.RegEx.Password
        }
    }
},{
    sequelize
});

TeacherGroups.init({
    TeacherGroupName:{
        type : datatypes.generalString,
        allowNull : false
    }
},{
    sequelize
});

TeacherGroupMembers.init({
    TeacherID:{
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
            model : Teachers,
            key : 'id'
        },
        unique : 'NoMultiMap_1'
    },
    TeacherGroupID:{
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
            model : TeacherGroups,
            key : 'id'
        },
        unique : 'NoMultiMap_1'
    }
},{
    sequelize
});

Rooms.init({
    RegionID:{
        type : Sequelize.INTEGER,
        allowNull : false,
        references:{
            model : Regions,
            key :'id'
        },
        unique: 'unique'
    },
    FloorNo : {
        type: Sequelize.INTEGER,
        allowNull : false,
        validate:{
            min:0,
            max:9
        },
        unique: 'unique'
    },
    Wing :{
        type : Sequelize.STRING(1),
        allowNull : false,
        validate:{
            isUppercase:true
        },
        unique: 'unique'
    },
    RoomNo :
    {
        type : Sequelize.INTEGER,
        allowNull : false,
        validate:{
            min: 1,
            max : 99
        },
        unique: 'unique'
    },
    RoomDescription :
    {
        type : datatypes.generalString
    }
    
},{
    sequelize
});

RoomGroups.init({
    RoomGroupName:{
        type : datatypes.generalString,
        allowNull : false
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