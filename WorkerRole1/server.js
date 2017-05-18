import GoogleMapsAPI from 'googlemaps';

const http = require('http');
const port = process.env.port || 1337;

http.createServer(function (req, res) {
    const gmAPI = new GoogleMapsAPI();
    let params = {
        center: '444 W Main St Lock Haven PA',
        zoom: 15,
        size: '500x400',
        maptype: 'roadmap',
        markers: [
            {
                location: '300 W Main St Lock Haven, PA',
                label: 'A',
                color: 'green',
                shadow: true
            },
            {
                location: '444 W Main St Lock Haven, PA',
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
            }
        ],
        style: [
            {
                feature: 'road',
                element: 'all',
                rules: {
                    hue: '0x00ff00'
                }
            }
        ],
        path: [
            {
                color: '0x0000ff',
                weight: '5',
                points: [
                    '41.139817,-77.454439',
                    '41.138621,-77.451596'
                ]
            }
        ]
    };
    let url = gmAPI.staticMap(params); // return static map URL
    // gmAPI.staticMap(params, function (err, binaryImage) {
    //     // fetch asynchronously the binary image
    // });

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(url);
}).listen(port);
