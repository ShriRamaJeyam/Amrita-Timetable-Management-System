var express = require('express');
var router = express.Router();
var database = require("../../../modules/database");
var Table = database.tables.SemesterRegistrations;
const {sequelize} =database;
router.post("/edit",async function(req,res){
    var transaction = await sequelize.transaction();
    try
    {
       const { SemesterID, DepartmentID, data } = req.body;
       await Table.destroy({ where : { SemesterID, DepartmentID}});
       let result = await Table.bulkCreate(data.map(rec => {
           return {
            SemesterID,
            DepartmentID,
            CourseID:rec
           };
       }));
       res.json(result);
    }
    catch(ex)
    {
        res.status(400).json({error : ex.toString()});
        if(transaction)
        {
           await transaction.rollback();
        }
    }
});

router.post("/get",async function(req,res){
  const { SemesterID, DepartmentID} = req.body;
  try
  {
     var record = await Table.findAll({ where : { SemesterID, DepartmentID} });
     res.json(record.map(rec => {
         return rec.CourseID;
     }));
  }
  catch(ex)
  {
      res.status(400).json({error : ex.toString()});
  }
});

module.exports = router;