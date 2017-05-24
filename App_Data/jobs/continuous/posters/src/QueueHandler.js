import TripFetcher from "./TripFetcher";
import GoogleMapsService from "./GoogleMapsService";
import axios from 'axios';
import {BLOB_PASS, BLOB_USER} from '../.env';
import azureStorage from 'azure-storage';
import fs from 'fs';
import WaypointsCollection from "./WaypointsCollection";

const TMP_DIRECTORY = 'tmp/';
const BLOB_CONTAINER = 'posters';
const API_STORE_URL = '';

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
        let localFilename = `poster-${hash}.png`;
        console.log(localFilename);

        fs.writeFile(TMP_DIRECTORY + localFilename, imageData, 'binary', err => {
            if (err) {
                console.log(err);
                throw err;
            }

            console.log('File saved locally.');
            this.saveToBlob(localFilename);
        });
    }

    saveToBlob(filename) {
        let localFilename = TMP_DIRECTORY + filename;

        this.blobService.createBlockBlobFromLocalFile(BLOB_CONTAINER, filename, localFilename, (error, result, response) => {
            console.log(result);
            if (error || !response.isSuccessful) {
                console.log(error);
            } else {
                console.log(`Blob ${filename} uploaded`);
                // fs.unlink(filename);

                this.successAction(result, filename);
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

    successAction(result, blobName) {
        console.log('Success', result);

        return;

        let blobService = azureStorage.createBlobService();

        let startDate = new Date();
        let expiryDate = new Date(startDate);
        let duration = 60 * 24 * 30 * 2;
        expiryDate.setMinutes(startDate.getMinutes() + duration);
        startDate.setMinutes(startDate.getMinutes() - 100);

        let sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: azureStorage.BlobUtilities.SharedAccessPermissions.READ,
                Start: startDate,
                Expiry: expiryDate
            },
        };

        let token = blobService.generateSharedAccessSignature(containerName, blobName, sharedAccessPolicy);
        let sasUrl = blobService.getUrl(BLOB_CONTAINER, blobName, token);

        axios.post(API_STORE_URL, {blob: sasUrl})
            .then(res => console.log('API Store success'))
            .catch(error => {
                console.log('API store fail. Error: ', error);

                throw error;
            });
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
