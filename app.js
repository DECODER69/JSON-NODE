const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 6969;

const prompt = require('prompt');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pogi"
})


app.get("/", (req, res) => {
        res.send("Hello Welcome to SENTINELS CRUD Operation using Node JS \n. Please input your credentials in terminal");

        prompt.start();
        prompt.get(['firstname', 'lastname', 'phone', 'address1', 'address2', 'email'],

            function(err, result) {
                if (err) { return onErr(err); }
                console.log('  Firstname: ' + result.firstname);
                console.log('  Lastname: ' + result.lastname);
                console.log('  Phone No.: ' + result.phone);
                console.log('  Address 1: ' + result.address1);
                console.log('  Address 2: ' + result.address2);
                console.log('  Email: ' + result.email);

                var sql = "INSERT INTO personal (firstName, lastName, phone, address1, address2, email) VALUES ?";
                var values = [
                    [result.firstname, result.lastname, result.phone, result.address1, result.address2, result.email]
                ];
                conn.query(sql, [values], function(err) {
                    if (err) throw err;
                    console.log('Sucessfully Added!')



                });

            });


        function onErr(err) {
            console.log(err);
            return 1;
        }
    }




);

app.get("/update", (req, res) => {




        prompt.start();
        prompt.get(['Please Type ID You want to Update']),
            prompt.get(['firstname', 'lastname', 'phone', 'address1', 'address2', 'email'],

                function(err, result) {
                    if (err) { return onErr(err); }
                    console.log('  Firstname: ' + result.firstname);
                    console.log('  Lastname: ' + result.lastname);
                    console.log('  Phone No.: ' + result.phone);
                    console.log('  Address 1: ' + result.address1);
                    console.log('  Address 2: ' + result.address2);
                    console.log('  Email: ' + result.email);

                    var sql = "INSERT INTO personal (firstName, lastName, phone, address1, address2, email) VALUES ?";
                    var values = [
                        [result.firstname, result.lastname, result.phone, result.address1, result.address2, result.email]
                    ];
                    conn.query(sql, [values], function(err) {
                        if (err) throw err;
                        console.log('Sucessfully Added!')



                    });

                });


        function onErr(err) {
            console.log(err);
            return 1;
        }
    }




);


app.listen(port, () => {
    console.log(`Connected in server: ${port}`);
});