var express = require('express');
var router = express.Router();
var database = require("../../../modules/database");
var Table = database.tables.Settings;

router.post("/get",async function(req,res){
    try
    {
       var result = await Table.findOrCreate({
           where:{
               SettingID:req.body.SettingID
            },defaults:{
                Data:JSON.stringify(null)
            }});
       res.json({SettingID:result[0].SettingID,Data:JSON.parse(result[0].Data)});
    }
    catch(ex)
    {
        res.status(400).json({error : ex.toString()});
    }
});

router.post("/set",async function(req,res){
    try
    {
        var search = await Table.findOne({where:{ SettingID:req.body.SettingID }});
        if(search)
        {
            var result = await search.update({ Data : JSON.stringify(req.body.Data) });
            res.json(result);
        }
        else
        {
            var result = await Table.create({
                SettingID: req.body.SettingID,
                Data : JSON.stringify(req.body.Data)
            });
            res.json(result);
        }
    }
    catch(ex)
    {
        res.status(400).json({error : ex.toString()});
    }
});

module.exports = router;