const hostname = "http://localhost:4000";
export const apiURL = {
    Regions:{
        list: hostname + "/api/Regions/list",
        edit: hostname + "/api/Regions/edit",
        create: hostname + "/api/Regions/create",
        get: hostname + "/api/Regions/get",
    }
}