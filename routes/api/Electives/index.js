var express = require('express');
var router = express.Router();
var database = require("../../../modules/database");
const { deepClone } = require("../../../modules/utils");
var Table = database.tables.Electives;

router.post("/create",async function(req,res){
    try
    {
      req.body.CoursesList = JSON.stringify(req.body.CoursesList);
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
    req.body.CoursesList = JSON.stringify(req.body.CoursesList);
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
     var result = deepClone(record);
     result.CoursesList = JSON.parse(result.CoursesList);
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