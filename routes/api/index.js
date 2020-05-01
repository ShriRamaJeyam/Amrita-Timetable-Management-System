var express = require('express');
var router = express.Router();
var fs = require('fs');

router.use("/Courses",require("./Courses/index"));
fs.readdir("./routes/api",function(err,items){
    items.forEach(dir => {
        if(dir !== "index.js")
        {
            router.use("/"+dir,require("./"+dir+"/index"));
        }
    });
})

module.exports = router;