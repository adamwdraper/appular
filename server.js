var express = require('express'),
    app = express(),
    port = process.env.PORT || 5000;

// app.use(express.logger());
app.use(express.compress());
app.use(express.static(__dirname));
app.set('views', __dirname);
app.set('view engine', 'html');

// Routes ---------------------------------------
app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.get('/test/?*', function (req, res) {
    res.sendfile('test.html');
});

// Listen ---------------------------------------
app.listen(port, function () {
    console.log('Listening on port ' + port);
});
