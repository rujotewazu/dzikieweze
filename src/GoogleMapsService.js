import {GOOGLE_MAPS_API_KEY} from "../.env";
import GoogleMapsAPI from 'googlemaps';

export default class GoogleMapsService {
    constructor() {
        this.config = {
            key: GOOGLE_MAPS_API_KEY
        };
        this.gmAPI = new GoogleMapsAPI(this.config)
    }

    generateUrl(coordinates) {
        let params = this.prepareParams(coordinates);

        return gmAPI.staticMap(params).replace('https://', 'http://');
    }

    generateMap(coordinates) {
        let params = this.prepareParams(coordinates);

        return new Promise((resolve, reject) => {
            this.gmAPI.staticMap(params, (err, binary) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(binary);
                }
            })
        });
    }

    prepareParams(coordinates) {
        let markers = [];
        let pathPoints = [];

        for (let cord of coordinates.points) {
            let point = `${cord.lat},${cord.lon}`;

            pathPoints.push(point);

            let marker = {
                location: point
            };

            let media = cord.getFirstMedia();

            if (media) {
                marker.icon = media;
            }

            markers.push(marker);
        }

        return {
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
    }
}
