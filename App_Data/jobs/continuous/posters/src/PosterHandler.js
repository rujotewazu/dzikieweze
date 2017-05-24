export default class PosterHandler {

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
                // fs.unlink(localFilename);

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
}
