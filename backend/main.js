var express = require('express');
var app = express();
const path = require('path');
var http = require('http');
var fs = require('fs');


//load view engine
app.use(express.static(path.join(__dirname, '../frontend/views')));
// app.engine('html', engines.mustache);
 
app.get('/', function (req, res) {
    res.send('edit.html');
})

const port = process.argv[2];


//start server
app.listen(port, function(){
    console.log('Server started on port '+port);
});

//bowserify TODO
// module.exports = 