const express = require("express");
const mysql = require("mysql2");
const app = express();
const bodyParser = require("body-parser");
const port = 4000;

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "sentinels"
});

//
app.use(bodyParser.json());


// CREATE(insert)
app.post("/users", (req, res) => {
    const { firstname, lastname, phone, address, email } = req.body;
    connection.query(
        "INSERT INTO crud (firstname, lastname, phone, address, email) VALUES (?, ?, ?, ?, ?)", [firstname, lastname, phone, address, email],
        (err, results) => {
            try {
                if (results.affectedRows > 0) {
                    res.json({ message: "Adding Successful" });
                    res.json({ results });
                    console.log(results)
                } else {
                    res.json({ message: "Adding Failed" });
                }
            } catch (err) {
                res.json({ message: err });
            }
        }
    );
});

// READ (select)
app.get("/users", (req, res) => {
    connection.query("SELECT * FROM crud", (err, results) => {
        try {
            if (results.length > 0) {
                res.json(results);
                console.log(results)
            }
        } catch (err) {
            res.json({ message: err });
        }
    });
});

// UPDATE (update)
app.put("/users", (req, res) => {
    const { id, firstname, lastname, phone, address, email } = req.body;

    if (id && firstname && lastname && phone && address && email) {
        connection.query(
            "UPDATE crud SET firstname = ?, lastname = ?, phone = ?, address = ?, email = ? WHERE id = ?", [firstname, lastname, phone, address, email, id],
            (err, results) => {
                try {
                    if (results.affectedRows > 0) {
                        res.json({ message: "Data has been updated!" });
                        console.log(results)
                    } else {
                        res.json({ message: "Something went wrong." });
                        console.log({ err })
                    }
                } catch (err) {
                    res.json({ message: err });
                }
            }
        );
    } else if (id) {
        connection.query(
            "UPDATE crud SET firstname = ?, lastname = ?, phone = ?, address = ?, email = ? WHERE id = ?", [firstname, lastname, phone, address, email, id],
            (err, results) => {
                try {
                    if (results.affectedRows > 0) {
                        res.json({ message: "Data has been updated!" });
                        console.log(results);
                    } else {
                        res.json({ message: "Something went wrong." });
                        console.log({ err });
                    }
                } catch (err) {
                    res.json({ message: err });
                }
            }
        );
    }
});

// DELETE
app.delete("/users", (req, res) => {
    const { id } = req.body;

    connection.query("DELETE FROM crud WHERE id = ?", [id], (err, results) => {
        try {
            if (results.affectedRows > 0) {
                res.json({ message: "Data has been deleted!" });
            } else {
                res.json({ message: "Something went wrong. \n Please check the error log" });
            }
        } catch (err) {
            res.json({ message: err });
        }
    });
});

app.listen(port, () => {
    console.log(`Connection secured on port ${port}`);
});