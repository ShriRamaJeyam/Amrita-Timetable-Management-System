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
class Sections extends Sequelize.Model {};
class Courses extends Sequelize.Model {};
class SectionGroups extends Sequelize.Model {};
class SectionGroupMembers extends Sequelize.Model {};
class SemesterRegistrations extends Sequelize.Model {};
class SectionRegistrations extends Sequelize.Model {};
class FacultyPreferences extends Sequelize.Model {};
class Lectures extends Sequelize.Model {};
class Solutions extends Sequelize.Model {};
class SolutionLectures extends Sequelize.Model {};
class Electives extends Sequelize.Model {};
class ElectiveCourses extends Sequelize.Model {};

Regions.init({
    Region:{
        type:datatypes.generalString,
        allowNull:false,
        unique:true
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{sequelize});

DayLists.init({
    DayName:{
        type:datatypes.generalString,
        allowNull:false,
        unique:true
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
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
            min : 0,
            max : 900
        }
    },
    ender:{
        type : Sequelize.INTEGER,
        allowNull: false,
        validate :{
            min : 0,
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
            min : 0,
            max : 900
        }
    },
    endBreak:{
        type : Sequelize.INTEGER,
        validate :{
            min : 0,
            max : 900
        }
    },
    description:{
        type : datatypes.generalString,
        unique:true,
        allowNull : false
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
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
        unique:true,
        allowNull : false
    },
    AskFacultyPref:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
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
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{
    sequelize
});

Programs.init({
    ProgramName:{
        type:datatypes.generalString,
        unique:true,
        allowNull:false
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{sequelize});

Semesters.init({
    ProgramID:{
        type:Sequelize.INTEGER,
        references:{
            model:Programs,
            key:'id'
        },
        unique:"Unique_Semester_For_Program",
        allowNull:false
    },
    SemesterNumber:
    {
        type:Sequelize.INTEGER,
        unique:"Unique_Semester_For_Program",
        allowNull:false
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
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
    /*PhoneNumber:{
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
    },*/
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{
    sequelize
});

TeacherGroups.init({
    TeacherGroupName:{
        type : datatypes.generalString,
        allowNull : false
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
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
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{
    sequelize
});

RoomGroups.init({
    RoomGroupName:{
        type : datatypes.generalString,
        allowNull : false,
        unique:true
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{
    sequelize
});

RoomGroupMembers.init({
    RoomID:{
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
            model : Rooms,
            key : 'id'
        },
        unique : 'NoMultiMap-RG'
    },
    RoomGroupID:{
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
            model : RoomGroups,
            key : 'id'
        },
        unique : 'NoMultiMap-RG'
    }
},{
    sequelize
});

Sections.init({
    SectionName:{
        type: Sequelize.STRING(1),
        unique :"NoRepeatSection",
        allowNull: false
    },
    SemesterID:{
        type : Sequelize.INTEGER,
        references :{
            model : Semesters,
            key:"id"
        },
        unique :"NoRepeatSection",
        allowNull: false
    },
    DepartmentID:{
        type: Sequelize.INTEGER,
        references:{
            model:Departments,
            key:'id'
        },
        unique:'NoRepeatSection',
        allowNull:false
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{ sequelize } );

Courses.init({
    CourseCode : {
        type :Sequelize.STRING(10),
        unique : true,
        allowNull: false
    },
    CourseName: {
        type : datatypes.generalString,
        allowNull: false
    },
    Theorey : {
        type : Sequelize.INTEGER,
        validate :{
            min: 0,
            max: 20
        },
        allowNull: false
    },
    TheoreySlot:{
        type : Sequelize.INTEGER
    },
    Lab : {
        type : Sequelize.INTEGER,
        validate :{
            min: 0,
            max: 20
        },
        allowNull: false
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{sequelize});

SectionGroups.init({
    SectionGroupName:{
        type : datatypes.generalString,
        allowNull : false
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{
    sequelize
});

SectionGroupMembers.init({
    SectionID:{
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
            model : Sections,
            key : 'id'
        },
        unique : 'NoMultiMap-SG'
    },
    SectionGroupID:{
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
            model : SectionGroups,
            key : 'id'
        },
        unique : 'NoMultiMap-SG'
    }
},{
    sequelize
});

SemesterRegistrations.init({
    SemesterID:{
        type : Sequelize.INTEGER,
        unique :"single-reg-sem",
        references : {
            model : Semesters,
            key:"id"
        },
        allowNull:false
    },
    DepartmentID:{
        type: Sequelize.INTEGER,
        references:{
            model:Departments,
            key:'id'
        },
        unique:"single-reg-sem",
        allowNull:false
    },
    CourseID:{
        type : Sequelize.INTEGER,
        unique :"single-reg-sem",
        references : {
            model : Courses,
            key:"id"
        },
        allowNull:false
    },
    NoOfLectures:{
        type:Sequelize.INTEGER,
        validate: {
            min:1,
            max:20
        },
        allowNull:false
    },
    TimeSlot:{
        type : Sequelize.INTEGER,
        allowNull:false,
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{sequelize});

SectionRegistrations.init({
    SectionID:{
        type : Sequelize.INTEGER,
        allowNull:false
    },
    FacultyID:{
        type : Sequelize.INTEGER,
        allowNull:false
    },
    CourseID:{
        type : Sequelize.INTEGER,
        references : {
            model : Courses,
            key:"id"
        },
        allowNull:false
    },
    Lectures:{
        type:Sequelize.INTEGER,
        validate: {
            min:1,
            max:20
        },
        allowNull:false
    },
    TimeSlot:{
        type : Sequelize.INTEGER,
        allowNull:false,
    },
    Generated:{
        type : Sequelize.BOOLEAN,
        defaultValue: false
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{sequelize});

Electives.init({
    ElectiveName:{
        type : datatypes.generalString,
        unique: true
    },
    SectionGroupID: Sequelize.INTEGER
},{
    sequelize 
});

ElectiveCourses.init({
    ElectiveID:{
        type : Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:Electives,
            key:"id"
        }
    },
    FacultyID:{
        type : Sequelize.INTEGER,
        allowNull:false
    },
    LabFacultyID:{
        type : Sequelize.INTEGER,
        allowNull:false
    },
    CourseID:{
        type : Sequelize.INTEGER,
        references : {
            model : Courses,
            key:"id"
        },
        allowNull:false
    },
},{ 
    sequelize
});

FacultyPreferences.init({
    TimeSlotID:{
        type : Sequelize.INTEGER,
        references :{
            model : TimeSlots,
            key : "id"
        },
        allowNull : false,
        unique : "NoMultiPreference"
    },
    Preference :{
        type : Sequelize.INTEGER,
        validate :{
            min : 1,
            max : 4
        },
        unique : "NoMultiPreference"
    }
},{sequelize});

Lectures.init({
    TimeSlot : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    Faculty : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    SectionID:{
        type : Sequelize.INTEGER,
        allowNull : false
    },
    CourseID:{
        type : Sequelize.INTEGER,
        allowNull : false
    },
    Room : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    DaySource : {
        type : Sequelize.TEXT,
        allowNull : false
    },
    Region:{
        type:Sequelize.INTEGER
    },
    Parent : { type : Sequelize.INTEGER }
},{sequelize});

Solutions.init({
    SolutionName : {
        type : datatypes.generalString,
        unique: true,
        allowNull : false
    },
    SoftViolations : {
        type : Sequelize.TEXT
    },
    HardViolations : {
        type : Sequelize.TEXT
    },
    Depreciated:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue : false
    }
},{sequelize});

SolutionLectures.init({
    SolutionID : {
        type : Sequelize.INTEGER,
        references : {
            model : Solutions,
            key : 'id'
        },
        allowNull : false
    },
    TimeSlot : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    Faculty : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    SectionID:{
        type : Sequelize.INTEGER,
        allowNull : false
    },
    CourseID:{
        type : Sequelize.INTEGER,
        allowNull : false
    },
    Room : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    Day : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    Parent : { type : Sequelize.INTEGER }
},{sequelize});

sequelize.sync().then(()=>{
    Globals.isDatabaseSynced = true;
});

module.exports = {
    sequelize,
    tables:{
        Settings,
        TimeSlots,
        TimeSlotGroups,
        TimeSlotGroupMembers,
        Departments,
        Programs,
        Semesters,
        Teachers,
        TeacherGroups,
        TeacherGroupMembers,
        DayLists,
        Regions,
        Rooms,
        RoomGroups,
        RoomGroupMembers,
        Sections,
        Courses,
        SectionGroups,
        SectionGroupMembers,
        SemesterRegistrations,
        SectionRegistrations,
        FacultyPreferences,
        Lectures,
        Solutions,
        SolutionLectures
    }
};