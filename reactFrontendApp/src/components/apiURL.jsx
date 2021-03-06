export const hostname = "http://localhost:4000";
var tbls = ["TeacherGroups","RoomGroups","Sections","Semesters","SectionGroups","Courses","Solutions"];
var tmp = {};
tbls.forEach(tbl => {
    tmp[tbl] = {
        list: hostname + `/api/${tbl}/list`,
        edit: hostname + `/api/${tbl}/edit`,
        create: hostname + `/api/${tbl}/create`,
        get: hostname + `/api/${tbl}/get`,
    };
});
export const apiURL = {
    GenSolLec:hostname +"/api/Solutions/generate",
    Regions:{
        list: hostname + "/api/Regions/list",
        edit: hostname + "/api/Regions/edit",
        create: hostname + "/api/Regions/create",
        get: hostname + "/api/Regions/get",
    },
    Programs:{
        list: hostname + "/api/Programs/list",
        edit: hostname + "/api/Programs/edit",
        create: hostname + "/api/Programs/create",
        get: hostname + "/api/Programs/get",
    },
    Departments:{
        list: hostname + "/api/Departments/list",
        edit: hostname + "/api/Departments/edit",
        create: hostname + "/api/Departments/create",
        get: hostname + "/api/Departments/get",
    },
    DayLists:{
        list: hostname + "/api/DayLists/list",
        edit: hostname + "/api/DayLists/edit",
        create: hostname + "/api/DayLists/create",
        get: hostname + "/api/DayLists/get",
    },
    Settings:{
        get: hostname + "/api/Settings/get",
        set: hostname + "/api/Settings/set"
    },
    Teachers:{
        list: hostname + "/api/Teachers/list",
        edit: hostname + "/api/Teachers/edit",
        create: hostname + "/api/Teachers/create",
        get: hostname + "/api/Teachers/get",
    },
    TimeSlots:{
        list: hostname + "/api/TimeSlots/list",
        edit: hostname + "/api/TimeSlots/edit",
        create: hostname + "/api/TimeSlots/create",
        get: hostname + "/api/TimeSlots/get",
    },
    Rooms:{
        list: hostname + "/api/Rooms/list",
        edit: hostname + "/api/Rooms/edit",
        create: hostname + "/api/Rooms/create",
        get: hostname + "/api/Rooms/get",
    },
    TimeSlotGroups:{
        list: hostname + "/api/TimeSlotGroups/list",
        edit: hostname + "/api/TimeSlotGroups/edit",
        create: hostname + "/api/TimeSlotGroups/create",
        get: hostname + "/api/TimeSlotGroups/get",
    },
    Electives:{
        list: hostname + "/api/Electives/list",
        edit: hostname + "/api/Electives/edit",
        create: hostname + "/api/Electives/create",
        get: hostname + "/api/Electives/get",
        delete: hostname +"/api/Electives/delete"
    },
    SectionRegistrations:{
        list: hostname + "/api/SectionRegistrations/list",
        edit: hostname + "/api/SectionRegistrations/edit",
        create: hostname + "/api/SectionRegistrations/create",
        get: hostname + "/api/SectionRegistrations/get",
        delete: hostname +"/api/SectionRegistrations/delete",
        generate : hostname + "/api/SectionRegistrations/generate"
    },
    SolutionLectures:{
        list: hostname + "/api/SolutionLectures/list",
        edit: hostname + "/api/SolutionLectures/edit",
        create: hostname + "/api/SolutionLectures/create",
        get: hostname + "/api/SolutionLectures/get",
        delete: hostname +"/api/SolutionLectures/delete",
    },
    SemesterRegistrations:{
        edit : hostname + "/api/SemReg/edit",
        get : hostname + "/api/SemReg/get"
    },
    ...tmp
}
