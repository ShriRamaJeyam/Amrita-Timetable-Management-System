var express = require('express');
var router = express.Router();

router.use("/Courses",require("./Courses/index"));

module.exports = router;