const express = require("express");
const bodyParser = require("body-parser");
const request = require("request"); // this is depreceated as of FEB 2020

const app = express();

// allow to serve static files with express
app.use(express.static("public"));

// allow bodyparser read with req.body.<>
app.use(bodyParser.urlencoded({extended:true}))

// get root url
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
  //res.send("This is my project")
});

app.post("/", function (req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  console.log(fname);
  console.log(lname);
  console.log(email);

// create the js object ; this will be the body parameters to send
//-> see the API documentation 
    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };
// create the JSON object string - flatpack JSON 
// -> this is what we send 
    const jsonData = JSON.stringify(data);

});

app.listen(3000, function () {
  console.log("App is listening at port 3000");
});


// API Key - Mailchimp
// 741486a230d400280bce9be28976c361-us8

// List ID - Mailchimp
// 3d65e130a6