import Waypoint from "./Waypoint";
export default class WaypointsCollection {
    constructor(waypoints = []) {
        this.points = [];
        this.setWaypoints(waypoints);
    }

    setWaypoints(waypoints) {
        for (let waypoint of waypoints) {
            this.push(waypoint);
        }
    }

    getPointByType(type) {
        let lat = Math[type].apply(Math, this.points.map(function (o) {
                return o.y;
            })),
            lon = Math[type].apply(Math, this.points.map(function (o) {
                return o.y;
            }));

        return new Waypoint(lat, lon);
    }

    min() {
        return this.getPointByType('min');
    }

    max() {
        return this.getPointByType('max');
    }

    zoom() {
        let GLOBE_WIDTH = 256,
            pixelWidth = 1,
            sw = this.max(),
            ne = this.min(),
            west = sw.lon,
            east = ne.lon,
            angle = east - west;

        if (angle < 0) {
            angle += 360;
        }

        return Math.round(Math.log(pixelWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
    }

    center() {
        let points = this.points;

        let total = points.length,
            lat = 0,
            lon = 0;

        if (total === 1) {
            return points.location;
        }

        for (let geoCoordinate of points) {
            lat += geoCoordinate.lat;
            lon += geoCoordinate.lon;
        }

        return new Waypoint(
            lat / total,
            lon / total
        );
    }

    push(waypoint) {
        if (waypoint instanceof Waypoint) {
            this.points.push(waypoint);

            return this;
        }

        if (typeof waypoint === 'object' && waypoint.hasOwnProperty('geometry')) {
            let geometry = waypoint.geometry;

            if (geometry.hasOwnProperty('type') && geometry.type === 'Point' && geometry.hasOwnProperty('coordinates') && Array.isArray(geometry.coordinates)) {
                this.points.push(
                    new Waypoint(geometry.coordinates[0], geometry.coordinates[1], waypoint.properties)
                );

                return this;
            }
        }

        throw new Error('Item must be instance of Waypoint or GeoJSON Object');
    }
}
