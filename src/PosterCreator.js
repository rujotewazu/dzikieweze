import * as fs from "fs";
import Canvas from "canvas";

const HEADER_HEIGHT = 50;

export default class PosterCreator {

    canvas() {
        fs.readFile(__dirname + '/../tmp/poster-c5b91248-04f7-1231-a629-07a4a8703893.png', function (err, file) {
            if (err) throw err;

            let Image = Canvas.Image,
                img = new Image;

            img.src = file;

            let canvas = new Canvas(img.width, img.height),
                ctx = canvas.getContext('2d'),
                title = 'Moja super wycieczka po Polsce!',
                te = ctx.measureText(title);

            canvas.height = img.height + HEADER_HEIGHT;

            ctx.fillRect(0, 0, img.width, img.height + HEADER_HEIGHT);

            let margin = (img.width - te.width) / 2;

            ctx.font = '30px Impact';
            ctx.fillText(title, margin, HEADER_HEIGHT - 10);

            ctx.drawImage(img, 0, HEADER_HEIGHT, img.width, img.height);

            // strip off the data: url prefix to get just the base64-encoded bytes
            let data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ""),
                buf = new Buffer(data, 'base64');

            fs.writeFile('tmp/canvas-image.png', buf);
        });
    }
}
