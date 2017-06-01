import * as fs from "fs";
import Canvas from "canvas";


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

            canvas.height = img.height + te.height;

            ctx.font = '30px Impact';
            ctx.fillText(title, 50, te.height);

            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            ctx.lineTo(50, te.height);
            ctx.lineTo(50 + te.width, te.height);
            ctx.stroke();


            ctx.drawImage(img, 0, te.height, img.width, img.height);

            // strip off the data: url prefix to get just the base64-encoded bytes
            let data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ""),
                buf = new Buffer(data, 'base64');

            fs.writeFile('tmp/canvas-image.png', buf);
        });
    }
}
