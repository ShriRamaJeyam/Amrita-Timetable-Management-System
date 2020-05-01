var express = require('express');
var router = express.Router();
var database = require("../../../modules/database");
var Courses = database.tables.Courses;

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

router.post("/edit",async function(req,res){
  const {CourseCode,CourseName,Theorey,Lab,id} = req.body;
  try
  {
     var record = await Courses.findOne({ where : { id } });
     var result = await record.update({CourseCode,CourseName,Theorey,Lab});
     console.log(result);
     res.json(result);
  }
  catch(ex)
  {
      res.status(400).json({error : ex.toString()});
  }
});

router.post("/get",async function(req,res){
  const params = req.body;
  try
  {
     var record = await Courses.findAll({ where : { ...params } });
     console.log(record);
     res.json(record);
  }
  catch(ex)
  {
      res.status(400).json({error : ex.toString()});
  }
});

router.post("/list",async function(req,res){
  try
  {
     var list = await Courses.findAll();
     console.log(list);
     res.json(list);
  }
  catch(ex)
  {
      res.status(400).json({error : ex.toString()});
  }
});


module.exports = router;