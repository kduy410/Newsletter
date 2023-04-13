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
    const audienceID = '12fd01cf68';
    const MAIL_CHIMP_API_KEY = '1e212dce363847029d8b1289cab1b4af-us12';
    const API_SERVER = 'us12'; // usX = 12
    const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${audienceID}`;

    const options = {
        method: "POST",
        auth: `key:${MAIL_CHIMP_API_KEY}`,
    };
    const request = https.request(url, options, (r) => {
        if (r.statusCode === 200) {
            res.sendFile(path.join(__dirname, "success.html"));
        } else {
            console.log(r.statusCode);
            res.sendFile(path.join(__dirname, "failure.html"));
        }
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

app.post('/failure', (req, res) => {
    res.redirect("/");
})

app.listen(3000, (req, res) => {
    console.log("Server is running on port 3000");
    console.log(path.join(__dirname, '/'));
})