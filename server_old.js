const http = require('http');
const fs = require('fs');


// Server object
const server = http.createServer((req, res) => {
    // lodash
    const num = _.random()

    res.setHeader('Content-Type', 'text/html'); //Set header content type
    // Set up routing
    let path = './html_templates/';
    switch(req.url) {
        case '/':
            path += 'index.html';
            res.statusCode = 200;
            break;
        case '/about':
            path += 'about.html';
            res.statusCode = 200;
            break;
        case '/about-blah': //Redirect about-me to about
            res.statusCode = 301;
            res.setHeader('Location', '/about');
            res.end()
            break;
        default:
            path += '404.html';
            res.statusCode = 404;
            break;
    }
    // Send html file
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.end(data);
        };
    });
});


//Set up the port which server will listen to
server.listen(3000, 'localhost', () => {
    console.log('Listening on port 3000');
});