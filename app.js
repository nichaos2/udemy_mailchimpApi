const express = require("express");
const bodyParser = require("body-parser");
const request = require("request"); // this is depreceated as of FEB 2020
const https = require("https");

const secureInfo = require('./.secureInfo.js')

const app = express();

// allow to serve static files with express
app.use(express.static("public"));

// allow bodyparser read with req.body.<>
app.use(bodyParser.urlencoded({ extended: true }));

// get root url
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
  //res.send("This is my project") // this just sends a line to the browser to check everythin works well
});

// post root url -> when we push the submit button
app.post("/", function (req, res) {
  // data I get from the signup page
  //req is the request from our page
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  // 1. create the data we took from our page
  // create the js object ; this will be the body parameters to send
  //-> see the API documentation on the structure
  const data_from_signup = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  // 1.b create the JSON object string - flatpack JSON
  // -> this is what we send
  const jsonData_from_signup = JSON.stringify(data_from_signup);

  // 2. create the request to mailchimp
  
  // 2.1 url -> see API for mailchimp endpoint : "https://usX.api.mailchimp.com/3.0/lists/{list_id}"
  // and list id in your own secureInfo file
  const X = secureInfo.server; // server of the mailchimp; is the last digit in the api key
  const list_id = secureInfo.list_id;
  const url = "https://us" + X + ".api.mailchimp.com/3.0/lists/" + list_id;
  
  // 2.2 options -> method, authentication, more
  const apiKey = secureInfo.apiKey;
  const options = {
    method: "POST",
    auth: "username_can_be_whatever:" + apiKey,
  };

  // 2.3 actual request
  const request_to_mailchimp = https.request(url, options, function (response) {
      //console.log(response);
    // do smth when getting the response callback function (optional)
    // response.on("data", function (data) {
    //   console.log(JSON.parse(data));
    // }); //- end of response.on
    // response.on("statusCode", function (status) {
    const status = response.statusCode;
    console.log(status);
    if (status === 200){
        res.sendFile(__dirname + "/success.html");
    }else{
        res.sendFile(__dirname + "/failure.html");
    }
    //   }); //- end of response.on
  }); //- end of request to mailchimp

  // 3. send the request
  request_to_mailchimp.write(jsonData_from_signup);

  //4. end the request -> this is necessary do NOT forget.
  request_to_mailchimp.end();

}); // end of post("/"")

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(3000, function () {
  console.log("App is listening at port 3000");
});