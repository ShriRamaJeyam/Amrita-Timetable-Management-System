const hostname = "http://localhost:4000";
export const apiURL = {
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
    }
}