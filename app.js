var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var hbs = require('express-handlebars');
var http = require('http');
var cluster = require('cluster');
var cookieParser = require('cookie-parser');
var app = express();
var cors = require('cors');

app.engine('hbs', hbs({extname: 'hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('port', process.env.PORT || 7770);
app.enable('trust proxy');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'flasky',
    resave: false,          
    saveUninitialized: false
}));
app.use(cors());
app.use('/', routes);

app.get('/login',
    function(req, res){
        req.session.user = {
            "username": "username",
            "nameIDFormat": "nameIDFormat",
            "completeName": "completeName",
            "givenName": "givenName",
            "email": "email"
        };

        res.redirect('/');
    }
);

app.use(function(req, res, next){
    res.render('404', { title: "404 Not Found", flag_error: true} );
});

app.use(function(error, req, res, next){
    console.log(error);
    res.render('500', { title: "Error", flag_error: true} );
});


if(cluster.isMaster){
    console.log('Fork %s worker(s) from master', 1);
    for(var i=0; i<1; i++)
        cluster.fork();
    cluster.on('online', function(worker){
        console.log('worker is running on %s pid', worker.process.pid);
    });
    cluster.on('exit', function(worker, code, signal){
        console.log('worker with %s is closed', worker.process.pid);
    });
}else if(cluster.isWorker){
    console.log('worker (%s) is now listening to http://127.0.0.1:%s', cluster.worker.process.pid, app.get('port'));
    app.get('*', function(req, res){
        res.send(200, 'cluster ' + cluster.worker.process.pid + 'responded \n');
    });
    var server = http.createServer(app).listen(app.get('port'));
}
