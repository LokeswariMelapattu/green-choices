# Green Choices Backend

## Running a Express Backend with Node.js 22.12.x

Follow these steps to get your Express backend running using Node.js .

## Prerequisites

- Node.js 22.12 (or later) installed on your machine
- npm (Node Package Manager)

## Steps

### 1. Install Node.js

If you don't have Node.js installed, you can download it from the official Node.js website:

- [Download Node.js](https://nodejs.org)

Alternatively, if you're using **nvm** (Node Version Manager), you can install Node.js 22.12 by running:

```bash
nvm install 22.12
nvm use 22.12
```

### 2.Run the following command to install all the necessary dependencies for your React app:

```bash
npm install
```

### 3.Start the Development Server

To start the app in development mode, run:

```bash
npm run dev
```

## API Planned Endpoints

`GET: /find-routes/` **Subjected to changes**

**Request Params**

```json
{
  "sourceCity": "Toronto",
  "sourceCountry": "Canada",
  "destinationCity": "Sydney",
  "destinationCountry": "Australia"
}
```

**Response Body**

```json
{
  "source": "Toronto, Canada",
  "destination": "Sydney, Australia",
  "routesFound": 3,
  "routes": [
    {
      "routeNumber": 1,
      "segments": [
        {
          "from": "Toronto, Canada",
          "to": "Tokyo, Japan",
          "fromGeoLocation": [43.6511, -79.3832],
          "toGeoLocation": [35.6895, 139.6917],
          "transportModes": ["sea", "plane"],
          "costs": [1200, 1500],
          "durations": [20, 10],
          "distances": [8500, 8000],
          "carbonEmissions": [150, 100]
        },
        {
          "from": "Tokyo, Japan",
          "to": "Sydney, Australia",
          "fromGeoLocation": [35.6895, 139.6917],
          "toGeoLocation": [-33.8688, 151.2093],
          "transportModes": ["sea", "plane"],
          "costs": [600, 800],
          "durations": [5, 10],
          "distances": [3000, 3500],
          "carbonEmissions": [80, 40]
        }
      ],
      "metrics": {
        "cost": {
          "minimum": 1800,
          "maximum": 2300
        },
        "duration": {
          "minimum": 15,
          "maximum": 30
        },
        "distance": {
          "minimum": 11000,
          "maximum": 12000
        },
        "carbonEmissions": {
          "minimum": 140,
          "maximum": 230
        }
      }
    },
    {
      "routeNumber": 3,
      "segments": [
        {
          "from": "Toronto, Canada",
          "to": "Singapore, Singapore",
          "fromGeoLocation": [43.6511, -79.3832],
          "toGeoLocation": [1.3521, 103.8198],
          "transportModes": ["sea", "plane"],
          "costs": [1800, 2000],
          "durations": [24, 12],
          "distances": [9500, 9000],
          "carbonEmissions": [200, 150]
        },
        {
          "from": "Singapore, Singapore",
          "to": "Sydney, Australia",
          "fromGeoLocation": [1.3521, 103.8198],
          "toGeoLocation": [35.6895, 139.6917],
          "transportModes": ["sea", "plane"],
          "costs": [500, 700],
          "durations": [6, 8],
          "distances": [2000, 2500],
          "carbonEmissions": [70, 40]
        }
      ],
      "metrics": {
        "cost": {
          "minimum": 2300,
          "maximum": 2700
        },
        "duration": {
          "minimum": 18,
          "maximum": 32
        },
        "distance": {
          "minimum": 11000,
          "maximum": 12000
        },
        "carbonEmissions": {
          "minimum": 190,
          "maximum": 270
        }
      }
    },
    {
      "routeNumber": 2,
      "segments": [
        {
          "from": "Toronto, Canada",
          "to": "Tokyo, Japan",
          "fromGeoLocation": [43.6511, -79.3832],
          "toGeoLocation": [35.6895, 139.6917],
          "transportModes": ["sea", "plane"],
          "costs": [1200, 1500],
          "durations": [20, 10],
          "distances": [8500, 8000],
          "carbonEmissions": [150, 100]
        },
        {
          "from": "Tokyo, Japan",
          "to": "Los Angeles, USA",
          "fromGeoLocation": [35.6895, 139.6917],
          "toGeoLocation": [34.0522, -118.2437],
          "transportModes": ["sea", "plane"],
          "costs": [1000, 1200],
          "durations": [20, 10],
          "distances": [8500, 8000],
          "carbonEmissions": [300, 400]
        },
        {
          "from": "Los Angeles, USA",
          "to": "Sydney, Australia",
          "fromGeoLocation": [34.0522, -118.2437],
          "toGeoLocation": [-33.8688, 151.2093],
          "transportModes": ["sea", "plane"],
          "costs": [1500, 1800],
          "durations": [25, 15],
          "distances": [9000, 8500],
          "carbonEmissions": [200, 150]
        }
      ],
      "metrics": {
        "cost": {
          "minimum": 3700,
          "maximum": 4500
        },
        "duration": {
          "minimum": 35,
          "maximum": 65
        },
        "distance": {
          "minimum": 24500,
          "maximum": 26000
        },
        "carbonEmissions": {
          "minimum": 550,
          "maximum": 750
        }
      }
    }
  ]
}
```
