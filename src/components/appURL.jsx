var tbls = ["TeacherGroups","RoomGroups","Sections","Semesters","SectionGroups","Courses","Electives"];
var tmp = {};
tbls.forEach(tbl => {
    tmp[tbl] = {
        list : `/${tbl}`,
        create : `/${tbl}/create`
    };

});
export const appURL = {
    Regions:{
        list:  "/Regions",
        create:  "/Regions/create",
    },
    Programs:{
        list:  "/Programs",
        create:  "/Programs/create",
    },
    Departments:{
        list:  "/Departments",
        create:  "/Departments/create",
    },
    DayLists:{
        list:  "/DayLists",
        create:  "/DayLists/create",
    },
    Teachers:{
        list:  "/Teachers",
        create:  "/Teachers/create",
    },
    TimeSlots:{
        list:  "/TimeSlots",
        create:  "/TimeSlots/create",
    },
    Rooms:{
        list:  "/Rooms",
        create:  "/Rooms/create",
    },
    TimeSlotGroups:{
        list:  "/TimeSlotGroups",
        create:  "/TimeSlotGroups/create",
    },
    ...tmp
}

