var express = require('express');
var Sequelize = require("sequelize");
var Op = Sequelize.Op;
var router = express.Router();
var database = require("../../../modules/database");
const { deepClone } = require("../../../modules/utils");
var Table = database.tables.SectionRegistrations;
const { sequelize } = database;
const { Sections, Semesters, SemesterRegistrations, Courses, Departments } = database.tables;
router.post("/generate",async function(req,res){
  var transaction = await sequelize.transaction();
  try
  {
    var Ans = [];
    
    var depts = await Departments.findAll({ where : { Depreciated:false } });
    var LiveDeptList = depts.map((sem) => {
      return sem.id;
    });
    var semesters = await Semesters.findAll({ where : { Depreciated:false } });
    var LiveSemList = semesters.map((sem) => {
      return sem.id;
    });
    var sections = await Sections.findAll({where : {
      [Op.and]:[
      {
        SemesterID:{
          [Op.in] : LiveSemList
        }
      },
      {
        DepartmentID:{
          [Op.in] : LiveDeptList
        }
      },
      {Depreciated: false}
    ]
    }});
    var courses = await Courses.findAll({where:{
      Depreciated:false
    }});
    var CourseMap = {};
    var LiveCourses = courses.map((crs)=> {
      CourseMap[crs.id] =crs;
      return crs.id;
    });
    var SemReg = await SemesterRegistrations.findAll({where:{
      CourseID:{
        [Op.in] : LiveCourses
      }
    }});
    var CrsLstMap = {};
    SemReg.forEach(reg => {
      var key = `${reg.SemesterID}_${reg.DepartmentID}`;
      if(CrsLstMap[key] === undefined)
      {
        CrsLstMap[key] = [];
      }
      CrsLstMap[key].push(reg.CourseID);
    });
    sections.forEach(ssn => {
      var key = `${ssn.SemesterID}_${ssn.DepartmentID}`;
      if(Array.isArray(CrsLstMap[key]))
      CrsLstMap[key].forEach(crs =>{
         var CrsData = CourseMap[crs];
         if(CrsData.Theorey !== 0)
         {
              Ans.push({
                SectionID: ssn.id,
                FacultyID: 0,
                RoomGroupID: 0,
                CourseID:crs,
                TimeSlot: CrsData.TheorySlot,
                Lectures: CrsData.Theorey
            });
         }
         if(CrsData.Lab !== 0)
         {
           Ans.push({
            SectionID: ssn.id,
            FacultyID: 0,
            RoomGroupID: 0,
            CourseID: crs,
            TimeSlot:CrsData.LabSlot,
            Lectures: CrsData.Lab
        });
         }
      });
    });
    await Table.destroy({ transaction });
    await Table.bulkCreate(Ans,{transaction});
    res.json({status:"ok"});
  }
  catch(ex)
  {
    res.status(400).json({error : ex.toString()});
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
    console.log(result);
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
   var record = await Table.findOne({ where : { ...params } }); 
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

router.post("/delete",async function(req,res){
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
});

module.exports = router;