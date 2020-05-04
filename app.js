const express = require("express");
const bodyParser = require("body-parser");
const request = require("request"); // this is depreceated as of FEB 2020

const app = express();

app.get("/", function(req,res){
    res.send("This is my project")
});


app.listen(3000, function () {
  console.log("App is listening at port 3000");
});
