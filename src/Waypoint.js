export default class Waypoint {
    constructor(lat, lon, props = {}) {
        this.lat = lat;
        this.lon = lon;
        this.properties = props;
    }
}
