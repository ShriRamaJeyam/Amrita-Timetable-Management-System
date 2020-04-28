var express = require('express');
var router = express.Router();
var database = require("../../../modules/database");
var Courses = database.tables.Courses;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(JSON.stringify(req.body));
});

router.post("/create",async function(req,res){
    const {CourseCode,CourseName,Theorey,Lab} = req.body;
    try
    {
       var result = await Courses.create({CourseCode,CourseName,Theorey,Lab});
       console.log(result);
       res.json(result);
    }
    catch(ex)
    {
        res.status(400).json({error : ex.toString()});
    }
});

module.exports = router;