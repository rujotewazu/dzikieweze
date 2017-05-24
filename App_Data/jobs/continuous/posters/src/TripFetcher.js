import axios from 'axios';
import WaypointsCollection from "./WaypointsCollection";
import sampleTrip from './sample.Points';
import Waypoint from "./Waypoint";

export default class TripFetcher {
    static fetch(url = '') {
        return axios.get(url);
    }

    static fake() {
        return axios.get('https://api.myjson.com/bins/1fgcwp');
    }

    static localPoints() {
        let waypoints = sampleTrip.features;
        let coordinates = new WaypointsCollection();

        for (let waypoint of waypoints) {
            let cords = waypoint.geometry.coordinates;

            coordinates.push(
                new Waypoint(
                    cords[0],
                    cords[1]
                )
            );
        }

        return new Promise((resolve, reject) => {
            resolve(coordinates);
        });
    }
}
