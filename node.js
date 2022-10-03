const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 6969;

// use to have prompt in terminal
const prompt = require('prompt');


const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pogi"

})


app.get("/", (req, res) => {
    res.send("SENTINELS TESTING CRUD");
});

app.get("/create", (req, res) => {
    res.send("Add User on Using Terminal")
    prompt.start();
    prompt.get(['firstname', 'lastname', 'phone', 'address1', 'address2', 'email'],
        function(err, result) {
            if (err) { return onErr(err); }
            console.log('Firstname: ' + result.firstname);
            console.log('Lastname: ' + result.lastname);
            console.log('Phone No.: ' + result.phone);
            console.log('Address 1: ' + result.address1);
            console.log('Address 2: ' + result.address2);
            console.log('Email: ' + result.email);

            var sql = "INSERT INTO personal (firstname, lastname, phone, address1, address2, email) VALUES ?";
            var values = [
                [result.firstname, result.lastname, result.phone, result.address1, result.address2, result.email]
            ];
            conn.query(sql, [values], function(err, results) {
                if (err) throw err;
                console.log(results);
                chk = results.affectedRows
                if (chk == '') {
                    console.log('No Availble Data');
                } else {
                    console.log('Successfully added')
                }
            });

        });

    function onErr(err) {
        console.log(err);
        return 1;
    }

});

app.get("/allusers", (req, res) => {
    var sql = "SELECT * FROM personal";
    res.write('List of all registered User\n\n\n')
    conn.query(sql, function(err, results) {
        if (err) throw err;
        for (let x = 0; x < results.length; x++) {

            var showresults =
                'FIRSTNAME:' + ' ' + results[x].firstname + ' ' + '\nLASTNAME:' + ' ' + results[x].lastname + ' ' + '\nPHONE NO.:' + ' ' + results[x].phone + ' ' +
                '\nADDRESS 1:' + ' ' + results[x].address1 + ' ' + '\nADDRESS 2:' + ' ' + results[x].address2 + ' ' + '\nEMAIL:' + ' ' + results[x].email + '\n' +
                '\n';
            res.write(showresults)
        }
        res.end()
        console.log(results)
    });

});

app.get("/update", (req, res) => {
    console.log(req.query);
    conn.query(
        "SELECT * FROM personal WHERE id = ?", [req.query.id],
        function(err, results) {
            console.log(results.firstName);
            // first check if there are results
            try {
                res.send(`Update credentials
                    for users ${results[0].firstname}`);
                prompt.start();
                prompt.get(['firstname', 'lastname', 'phone', 'address1', 'address2', 'email'],
                    function(err, result) {
                        if (err) { return onErr(err); }
                        console.log('Firstname: ' + result.firstname);
                        console.log('Lastname: ' + result.lastname);
                        console.log('Phone No.: ' + result.phone);
                        console.log('Address 1: ' + result.address1);
                        console.log('Address 2: ' + result.address2);
                        console.log('Email: ' + result.email);

                        var sql = "UPDATE personal SET firstName = ?, lastName = ?, phone = ?, address1 = ?, address2 = ?, email = ? WHERE id = ?";

                        conn.query(sql, [result.firstname, result.lastname, result.phone, result.address1, result.address2, result.email, req.query.id], function(err, results) {
                            if (err) throw err;
                            console.log(results);
                            chk = results.affectedRows
                            if (chk == '') {
                                console.log('No Data Available. Add User ID on Browser to select User to Update');
                            } else {
                                console.log('Successfully Updated')
                            }
                        });

                    });

                function onErr(err) {
                    console.log(err);
                    return 1;
                }
            } catch (err) {
                res.send(`ID Does not Exist\n`);

            }
        }
    );
});

app.get("/delete", (req, res) => {
    console.log(req.query);
    conn.query(
        "DELETE FROM personal WHERE id = ?", [req.query.id],
        function(err, results) {
            console.log(results);
            // first check if there are results
            chk = results.affectedRows
            if (chk == '') {
                console.log('error');
                res.send("No Data Available. Add User ID on Browser to select User to delete")
            } else {
                console.log('Successfully Deleted')
                res.send("SUCCESSFULLY DELETED")
            }

        }
    );
});



app.listen(port, () => {
    console.log(`Connected in server: ${port}`);
});