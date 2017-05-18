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
        pixelWidth = 1,sw = getMaxGeoPoint(points),
        ne = getMinGeoPoint(points),
        west = sw.lon,
        east = ne.lon,
        angle = east - west;

    if (angle < 0) {
        angle += 360;
    }

    return Math.round(Math.log(pixelWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
};

let getGeoPoint = function(points, type) {
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

let getMinGeoPoint = function(points) {
    return getGeoPoint(points, 'min');
};
let getMaxGeoPoint = function(points) {
    return getGeoPoint(points, 'max');
};

http.createServer(function (req, res) {
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
    let url = gmAPI.staticMap(params);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<img src="${url}"/>`);
}).listen(port);
