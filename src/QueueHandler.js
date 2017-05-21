import TripFetcher from "./TripFetcher";
import GoogleMapsService from "./GoogleMapsService";
import http from 'http';
import {BLOB_PASS, BLOB_USER} from '../.env';
import azureStorage from 'azure-storage';
import fs from 'fs';
import WaypointsCollection from "./WaypointsCollection";

export default class QueueHandler {
    constructor() {
        this.mapsGenerator = new GoogleMapsService();
        this.blobService = azureStorage.createBlobService(BLOB_USER, BLOB_PASS);
    }

    process(tripId = null) {
        this.getWaypoints(tripId)
            .then(({data}) => {
                let waypoints = new WaypointsCollection(data.features);

                this.fetchMap(waypoints);
            })
            .catch(error => {
                console.log(error);
                throw new Error('Failed to fetch waypoints');
            });
    }

    saveFile(imageData) {
        let hash = this.guid();
        let localFilename = `tmp/poster-${hash}.png`;
        console.log(localFilename);

        fs.writeFile(localFilename, imageData, 'binary', err => {
            if (err) {
                console.log(err);
                throw err;
            }

            console.log('File saved locally.');
            this.saveToBlob(localFilename);
        });
    }

    saveToBlob(localFilename) {
        this.blobService.createBlockBlobFromLocalFile('posters', localFilename, localFilename, (error, result, response) => {
            if (error || !response.isSuccessful) {
                console.log(error);
            } else {
                console.log(`Blob ${localFilename} uploaded`);
                fs.unlink(localFilename);

                this.successAction(result);
            }
        });
    }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    getWaypoints(tripId = null) {
        if (tripId === null) {
            return TripFetcher.fake();
        }

        return TripFetcher.fetch(tripId);
    }

    successAction(result) {
        console.log('Success');
    }

    fetchMap(waypoints) {
        this.mapsGenerator.generateMap(waypoints)
            .then(map => this.saveFile(map))
            .catch(error => {
                console.log(error);

                throw error;
            });
    }
}
