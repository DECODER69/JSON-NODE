const express = require("express");
const mysql = require("mysql2");
const app = express();
const bodyParser = require("body-parser");
const port = 4000;


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "sentinels",
});

app.use(bodyParser.json());

// CREATE(insert)
app.post("/upload", (req, res) => {
    const { date_time } = req.body;
    connection.query(
        "INSERT INTO detected (date_time) VALUES (?)", [date_time],
        (err, results) => {
            try {
                if (results.affectedRows > 0) {
                    res.json({ message: "Data has been added!" });

                } else {
                    res.json({ message: "Something went wrong." });
                }
            } catch (err) {
                res.json({ message: err });
            }
        }
    );
});


app.get("/count", (req, res) => {
    connection.query("SELECT count (*) FROM detected", (err, results) => {

        try {
            if (results.length > 0) {
                res.json(results);
                console.log(results)
            } else {
                res.json({ message: "Something went wrong." });
            }
        } catch (err) {
            res.json({ message: err });
        }

    });
});

app.get("/view", (req, res) => {
    connection.query("SELECT * FROM detected", (err, results) => {

        try {
            if (results.length > 0) {
                res.json(results);
                console.log(results)
            } else {
                res.json({ message: "Something went wrong." });
            }
        } catch (err) {
            res.json({ message: err });
        }

    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});