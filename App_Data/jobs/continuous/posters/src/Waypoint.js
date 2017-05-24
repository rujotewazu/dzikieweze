export default class Waypoint {
    constructor(lat, lon, props = {}) {
        this.lat = lat;
        this.lon = lon;
        this.properties = props;
    }

    hasMedias() {
        let properties = this.properties;

        return typeof properties === 'object' && properties.hasOwnProperty('medias') && Array.isArray(properties.medias) && properties.medias.length > 0;
    }

    getMedias() {
        if (this.hasMedias()) {
            return this.properties.medias;
        }

        return null;
    }

    getFirstMedia() {
        let medias = this.getMedias();

        if (medias) {
            return medias[0];
        }

        return null;
    }
}
