const Gfns = require("../../utils/GroupManager/functions");
var express = require('express');
var router = express.Router();
var database = require("../../../modules/database");

const config = {
    GroupTable : database.tables.TeacherGroups,
    MemberTable : database.tables.TeacherGroupMembers,
    MemberName : "TeacherID",
    GroupName : "TeacherGroupID",
    NameItem : "TeacherGroupName"
};

router.post("/create",Gfns.create(config));
router.post("/edit",Gfns.edit(config));
router.post("/get",Gfns.get(config));
router.post("/list",Gfns.list(config));

module.exports = router;
