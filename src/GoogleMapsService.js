import {GOOGLE_MAPS_API_KEY} from "../.env";
import GoogleMapsAPI from "googlemaps";

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

    static max(a, b) {
        if (a > b) {
            return a;
        } else {
            return b;
        }
    }

    static min(a, b) {
        if (a > b) {
            return a;
        } else {
            return b;
        }
    }

    /*
     * Please note that this function is highly unoptimized
     */
    checkForWaypointHighDensity(coordinates, gridSize = 8, maxDensity = 4) {

        // find borders
        let latMin = 999;
        let latMax = -999;
        let lonMin = 999;
        let lonMax = -999;
        for (let point of coordinates.points) {
            latMin = GoogleMapsService.min(latMin, point.lat);
            latMax = GoogleMapsService.max(latMax, point.lat);
            lonMin = GoogleMapsService.min(lonMin, point.lon);
            lonMax = GoogleMapsService.max(lonMax, point.lon);
        }

        // calculate grid cell size
        let gridX = (latMax - latMin) / gridSize;
        let gridY = (lonMax - lonMin) / gridSize;

        // initialize grid
        let tooHighDensityAreas = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let gridCell = {
                    latMin:  i * gridX,
                    latMax:  (i + 1) * gridX,
                    lonMin:  j * gridY,
                    lonMax:  (j + 1) * gridY,
                    density: 0
                };
                for (let point of coordinates.points) {
                    if (point.lat >= gridCell.latMin && point.lat <= gridCell.latMax
                        && point.lon >= gridCell.lonMin && point.lon <= gridCell.lonMax) {
                        gridCell.density = gridCell.density + 1;
                    }
                }
                if (gridCell.density >= maxDensity) {
                    tooHighDensityAreas.push(gridCell);
                }
            }
        }

        return tooHighDensityAreas;
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
