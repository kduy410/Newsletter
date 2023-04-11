const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
})

app.post("/", (req, res) => {
    var data = JSON.stringify({
        members: [
            {
                email_address: req.body.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.fname,
                    LNAME: req.body.lname,
                }
            }
        ]
    });
    const audienceID = '477cf5d990';
    const MAIL_CHIMP_API_KEY = 'd3493b2c2e3a9b99cb3cb2e6c3e17b01-us8'; // usX = 8
    const API_SERVER = 'us8'; // usX = 8
    const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${audienceID}`;
    const options = {
        method: "POST",
        auth: `key:${MAIL_CHIMP_API_KEY}`,
    };
    const request = https.request(url, options, (r) => {
        r.on('data', (d) => {
            var data = JSON.parse(d);
            console.log(data.new_members);
            console.log(data.updated_members);
            console.log(data.errors);
        })
    });
    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    
    request.write(data);
    request.end();
})

app.listen(3000, (req, res) => {
    console.log("Server is running on port 3000");
    console.log(path.join(__dirname, '/'));
})