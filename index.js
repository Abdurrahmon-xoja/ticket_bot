const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type'],
}));

const port = 3000;

// // Middleware to parse JSON bodies
app.use(bodyParser.json());


//Database

const sqlite3 = require('sqlite3').verbose();
let sql;

//conect to db
const db = new sqlite3.Database("./ticket.db",sqlite3.OPEN_READWRITE,(err)=>{
    if(err) return console.log(err.message);
});
 
// sql = `CREATE TABLE ticket(id)`;
// db.run(sql);

// db.run("DROP TABLE ticket")

//Insert  DB
function addId(name){
sql = `INSERT INTO ticket(id) VALUES(?)`;
db.run(sql,[name],(err) => {
    if(err) console.log(err.message);
})
}



//Querry 
async function checkIfExist(name) {
    const sql = `SELECT * FROM ticket WHERE id = ?`;

    return new Promise((resolve, reject) => {
        db.all(sql, [name], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
                return;
            }

            // Check if any row matches the given ID
            const exists = rows.some(row => row.id === name);
            resolve(exists);
        });
    });
}

async function getLength() {
    const sql = `SELECT COUNT(*) AS count FROM ticket`;

    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
                return;
            }

            // Return the count of all documents (rows) in the table
            resolve(row.count);
        });
    });
}


// POST request handler
app.post('/checkIdAndAdd', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData.id);

    (async () => {
    try {
        console.log("--------");
        const exists = await checkIfExist(receivedData.id);
        console.log(`ID exists: ${exists}`);
        if(exists){

        }else{
            addId(receivedData.id);
        }

        res.send({ message: 'Data received successfully', data: exists });
    } catch (error) {
        console.error('Error checking existence:', error);
    }
    })();
});


app.get('/getLength', (req, res) => {
    (async () => {
    try {
        console.log("--------");
        const length = await getLength();
        console.log(`ID exists: ${length}`);
       
        res.send({ message: 'Data received successfully', data: length });
    } catch (error) {
        console.error('Error checking existence:', error);
    }
    })();
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




