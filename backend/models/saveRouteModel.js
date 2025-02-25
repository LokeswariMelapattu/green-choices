const sqlite3 = require('sqlite3').verbose();
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

    if(!(await tableExists(db))) {
        await createRouteTable(db);
    }

    return true;

}

async function openDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log("❌ Error opening database: " + err.message);
                resolve(false);

            } else {
                console.log("✅ Database opened successfully.");
                resolve(db);
            }
        });
    });
}

async function tableExists(db) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [routeTable], (err, row) => {
            if (err) resolve(false);
            else resolve(!!row);  // Convert row to true/false
        });
    });
}

// migth at least to need to include order number so it can be connected to a possible order table
// could also be changed to include the table name as a pram, so it could be used for making other tables 
async function createRouteTable(db) {
    db.run(`CREATE TABLE ${routeTable}(id INTEGER PRIMARY KEY, routeData)`)
    
    // just to check when the table is created during development
    console.log("Table Created"); 
}

module.exports = {
    saveRouteToDB
};