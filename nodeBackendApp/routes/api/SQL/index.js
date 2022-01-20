var express = require('express');
var router = express.Router();
var database = require("../../../modules/database");
var { QueryTypes } = require("sequelize");
router.post("/",async function(req,res){
    try
    {
        const result = await database.sequelize.query(req.body.sql, { type: QueryTypes.SELECT });
        res.json(result);
    }
    catch(ex)
    {
        res.status(400).json({error : ex.toString()});
    }
});

module.exports = router;