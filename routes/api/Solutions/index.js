var express = require('express');
var router = express.Router();
var database = require("../../../modules/database");
var {deepClone} = require("../../../modules/utils");
var Table = database.tables.Solutions;
const { sequelize } = database;
const { Electives, SectionRegistrations, Courses,SolutionLectures } = database.tables;

router.post("/generate",async function(req,res){
  var transaction = await sequelize.transaction();
  var Lectures = [];
  var info=[];
  try
  {
    if( typeof(req.body.SolutionID) !== "number" )
    {
      throw "SolutionID is not present";
    }
    await SolutionLectures.destroy({where:{SolutionID:req.body.SolutionID},transaction});
    var secReg = await SectionRegistrations.findAll();
    secReg.forEach(sreg =>{
      for(var i=0;i<sreg.Lectures;i++)
      {
        Lectures.push({
          SolutionID:req.body.SolutionID,
          Faculty:sreg.FacultyID,
          SectionID:sreg.SectionID,
          CourseID:sreg.CourseID,
          TimeSlotSource:sreg.TimeSlot,
          RoomSource:sreg.RoomGroupID,
          DaySource:"[1,2,3,4,5]",
      });
      }
    });
    var courses = await Courses.findAll();
    var CourseMap = {};
    courses.forEach((crs)=> {
      CourseMap[crs.id] =crs;
    });
    var electives = deepClone(await Electives.findAll());
    for(var x=0;x!=electives.length;x++)
    {
      var ele =electives[x];
      ele.CoursesList = JSON.parse(ele.CoursesList);
      var updated = true;
      var i = 0;
      while(updated)
      {
        updated = false;
        var childThe=[];
        var childLab=[];
        
        ele.CoursesList.forEach(cl =>{
          info.push(CourseMap[cl.course].Theorey);
          if(CourseMap[cl.course] && CourseMap[cl.course].Theorey > i)
          {
            updated =true;
            childThe.push({
              SolutionID:req.body.SolutionID,
              Faculty:cl.theoreyteacher,
              SectionID:ele.SectionGroupID,
              CourseID:cl.course,
              TimeSlotSource:ele.TheoreySlot,
              RoomSource:cl.theoreyrooms,
              DaySource:"[1,2,3,4,5]",
          });
          }
          if(CourseMap[cl.course] && CourseMap[cl.course].Lab > i)
          {
            updated =true;
            childLab.push({
              SolutionID:req.body.SolutionID,
              Faculty:cl.labteacher,
              SectionID:ele.SectionGroupID,
              CourseID:cl.course,
              TimeSlotSource:ele.LabSlot,
              RoomSource:cl.labrooms,
              DaySource:"[1,2,3,4,5]",
          });
          }
        });
        info.push(childThe,childLab);
        if(childThe.length !== 0)
          {
              var dummy = await SolutionLectures.create({
                SolutionID:req.body.SolutionID,
                Faculty:0,
                SectionID:ele.SectionGroupID,
                CourseID:0,
                TimeSlotSource:ele.TheoreySlot,
                RoomSource:0,
                DaySource:"[1,2,3,4,5]",
            },{transaction});
            childThe.forEach(ct =>{ct.Parent = dummy.id;})
            Lectures.push(...childThe);
          }
          if(childLab.length !== 0)
          {
            var dummy = await SolutionLectures.create({
              SolutionID:req.body.SolutionID,
              Faculty:0,
              SectionID:ele.SectionGroupID,
              CourseID:0,
              TimeSlotSource:ele.LabSlot,
              RoomSource:0,
              DaySource:"[1,2,3,4,5]",
            },{transaction});
            childLab.forEach(ct =>{ct.Parent = dummy.id;})
            Lectures.push(...childLab);
          }
        i = i+1;
      }
    };
    await SolutionLectures.bulkCreate(Lectures,{transaction});
    transaction.commit();
    res.json({status:"ok",info,Lectures})
  }
  catch(ex)
  {
    res.status(400).json({error : ex.toString(),Lectures});
    if (transaction) 
    {
      await transaction.rollback();
    }
  }
});

router.post("/create",async function(req,res){
    try
    {
       var result = await Table.create({ ...(req.body) });
       res.json(result);
    }
    catch(ex)
    {
        res.status(400).json({error : ex.toString()});
    }
});

router.post("/edit",async function(req,res){
  const {id} = req.body;
  try
  {
     var record = await Table.findOne({ where : { id } });
     var result = await record.update({ ...(req.body) });
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
     var record = await Table.findAll({ where : { ...params } });
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
     var list = await Table.findAll();
     res.json(list);
  }
  catch(ex)
  {
      res.status(400).json({error : ex.toString()});
  }
});

/* router.post("/delete",async function(req,res){
  const {id} = req.body;
  try
  {
     var record = await Table.findOne({ where : { id } });
     var result = await record.destroy();
     res.json(result);
  }
  catch(ex)
  {
      res.status(400).json({error : ex.toString()});
  }
}); */


module.exports = router;