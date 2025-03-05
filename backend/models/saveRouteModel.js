const path = require('path');
const { CONFIG } = require('../utils/constants');

const dbPath = path.resolve(__dirname, '../data/database.db');
const routeTable = 'savedRoutes';

const testRoute = {
    "routeNumber": 3,
    "segments": [
        {
            "from": "New York, USA",
            "to": "Madrid, Spain",
            "fromGeoLocation": [
                40.7128,
                -74.006
            ],
            "toGeoLocation": [
                40.4168,
                -3.7038
            ],
            "transportModes": [
                "plane"
            ],
            "costs": [
                700,
                1000
            ],
            "durations": [
                15,
                5
            ],
            "distances": [
                5500,
                5000
            ],
            "carbonEmissions": [
                100,
                50
            ]
        },
        {
            "from": "Madrid, Spain",
            "to": "Berlin, Germany",
            "fromGeoLocation": null,
            "toGeoLocation": [
                52.52,
                13.405
            ],
            "transportModes": [
                "road",
                "plane"
            ],
            "costs": [
                300,
                400
            ],
            "durations": [
                12,
                3
            ],
            "distances": [
                2500,
                2000
            ],
            "carbonEmissions": [
                70,
                30
            ]
        },
        {
            "from": "Berlin, Germany",
            "to": "Warsaw, Poland",
            "fromGeoLocation": null,
            "toGeoLocation": [
                52.2297,
                21.0122
            ],
            "transportModes": [
                "road",
                "plane"
            ],
            "costs": [
                300,
                200
            ],
            "durations": [
                6,
                1
            ],
            "distances": [
                1200,
                1000
            ],
            "carbonEmissions": [
                40,
                20
            ]
        },
        {
            "from": "Warsaw, Poland",
            "to": "Helsinki, Finland",
            "fromGeoLocation": null,
            "toGeoLocation": [
                52.2297,
                21.0122
            ],
            "transportModes": [
                "road",
                "plane"
            ],
            "costs": [
                300,
                200
            ],
            "durations": [
                8,
                2
            ],
            "distances": [
                1200,
                1000
            ],
            "carbonEmissions": [
                40,
                20
            ]
        }
    ],
    "metrics": {
        "cost": {
            "minimum": 1400,
            "maximum": 2000
        },
        "duration": {
            "minimum": 11,
            "maximum": 41
        },
        "distance": {
            "minimum": 9000,
            "maximum": 10400
        },
        "carbonEmissions": {
            "minimum": 120,
            "maximum": 250
        }
    }
};

async function saveRouteToDB(route) {
    
    db = await openDatabase();

    if(!db) {
        return false;
    }

    let doesTableExist = await tableExists(db);

    if(!doesTableExist) {
        tableCreated = await createRouteTable(db);
        if(!tableCreated) {
            return false;
        }
    }

    isRouteSaved = await addRoute(db, route);

    return isRouteSaved;

}

async function openDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("Error opening database: " + err.message);
                resolve(false);

            } else {
                console.log("Database opened successfully.");
                resolve(db);
            }
        });
    });
}

async function tableExists(db) {
    return new Promise(async (resolve, reject) => {
        await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [routeTable], (err, row) => {
            if (err) resolve(false);
            else resolve(!!row);  // Convert row to true/false
        });
    });
}

// migth at least to need to include order number so it can be connected to a possible order table
// could also be changed to include the table name as a pram, so it could be used for making other tables 
async function createRouteTable(db) {
    return new Promise(async (resolve, reject) => {
        await db.run(`CREATE TABLE ${routeTable}(id INTEGER PRIMARY KEY, routeData)`, (err) => {
            if (err) {
                resolve(false);
            } else {
                // just to check when the table is created during development
                console.log("Table Created"); 
                resolve(true);
            }
        })
    });
}

async function addRoute(db, route) {
    routeString = JSON.stringify(route)

    return new Promise(async (resolve, reject) => {
        await db.run(`INSERT INTO ${routeTable}(routeData) VALUES (?)`, [routeString], (err) => {
            if (err) {
                console.log("Error adding data to table: " + err.message);
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

module.exports = {
    saveRouteToDB
};

/*
// development zone -------------------------------------------------------------------------
// just check everything works, usefull when loading routes is going to be implemented
async function readRouteTable() {
    db = await openDatabase();

    db.all(`SELECT * FROM ${routeTable}`, [], (err, rows) => {
        if (err) {
            console.log("Error reading data to table: " + err.message);
        }
        rows.forEach(row => {
            console.log(`Row ID: ${row.id}`);
            console.log(`Route data: ${row.routeData}`);
        })
    })
}

// be carefull with this one
// also dropping the table doesn't clear the file empty, for development usage could empty the file automatically,
// currently needs to be done manually
async function dropRouteTable() {
    db = await openDatabase();

    db.run(`DROP TABLE ${routeTable}`)
    
    // just to check when the table is dropped
    console.log("Table Dropped"); 
}
//

//saveRouteToDB(testRoute);
//readRouteTable();
//dropRouteTable()
*/
//saveRouteToDB(testRoute);
