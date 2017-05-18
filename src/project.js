import http from 'http';
import {GOOGLE_MAPS_API_KEY} from '../.env';
import GoogleMapsAPI from 'googlemaps';
import sampleTrip from './sample';

const port = process.env.port || 1337;
const config = {
    key: GOOGLE_MAPS_API_KEY
};

let centerFunction = function (geoCoordinates) {
    let total = geoCoordinates.length,
        lat = 0,
        lon = 0;

    if (total === 1) {
        return geoCoordinates.location;
    }

    for (let geoCoordinate of geoCoordinates) {
        lat += geoCoordinate.lat;
        lon += geoCoordinate.lon;
    }

    return {
        lat: lat / total,
        lon: lon / total
    };
};

let calculateZoom = function (points) {
    let GLOBE_WIDTH = 256,
        pixelWidth = 1, sw = getMaxGeoPoint(points),
        ne = getMinGeoPoint(points),
        west = sw.lon,
        east = ne.lon,
        angle = east - west;

    if (angle < 0) {
        angle += 360;
    }

    return Math.round(Math.log(pixelWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
};

let getGeoPoint = function (points, type) {
    let lat = Math[type].apply(Math, points.map(function (o) {
            return o.y;
        })),
        lon = Math[type].apply(Math, points.map(function (o) {
            return o.y;
        }));

    return {
        lat,
        lon
    };
};

let getMinGeoPoint = function (points) {
    return getGeoPoint(points, 'min');
};
let getMaxGeoPoint = function (points) {
    return getGeoPoint(points, 'max');
};

function urlGenerator() {
    const gmAPI = new GoogleMapsAPI(config);

    let waypoints = sampleTrip.features;
    let coordinates = [];
    let markers = [];
    let pathPoints = [];

    for (let waypoint of waypoints) {
        let cords = waypoint.geometry.coordinates;
        coordinates.push({
            lat: cords[0],
            lon: cords[1]
        });
    }

    let center = centerFunction(coordinates);
    let zoom = calculateZoom(coordinates);

    for (let cord of coordinates) {
        let point = `${cord.lat},${cord.lon}`;
        pathPoints.push(point);
        markers.push({
            location: point
        });
    }

    let params = {
        // center: `${center.lat},${center.lon}`,
        // zoom: zoom,
        size: '1000x800',
        maptype: 'roadmap',
        markers: markers,
        path: [
            {
                color: '0x0000ff',
                weight: '5',
                points: pathPoints
            }
        ]
    };

    let mapUrl = gmAPI.staticMap(params).replace('https://', 'http://');

    return mapUrl;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

let mapUrl = urlGenerator();
import azureStorage from 'azure-storage';
import fs from 'fs';

const blobService = azureStorage.createBlobService('tripappdisks435', 'goOmWqmWbUi6OvMMRuOBKeaGjYuBRI4J0UZGj7LUn4VmgiCGvdOuwvKTuJLdXJpAAm3u7SejQTeiaHUnx5ltHg==');

console.log('map: ', mapUrl);

// let request = require('request').defaults({encoding: null});
http.get(mapUrl, function (res) {
    //process exif here
    // console.log('body', buffer);
    let imagedata = '';
    res.setEncoding('binary');

    res.on('data', function (chunk) {
        imagedata += chunk
    });

    res.on('end', function () {
        let hash = guid();
        let localFilename = `tmp/poster-${hash}.png`;
        console.log(localFilename);

        fs.writeFile(localFilename, imagedata, 'binary', function (err) {
            if (err) {
                console.log(err);
                throw err;
            }

            console.log('File saved.');

            blobService.createBlockBlobFromLocalFile('posters', localFilename, localFilename, function (error, result, response) {
                if (!error) {
                } else {
                    console.log(`Blob ${localFilename} uploaded`);
                    fs.unlink(fileName);
                    fs.unlink(localFilename);
                }
            });
        });
    });
});
