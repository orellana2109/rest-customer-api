const restify = require('restify');
const mongoose = require('mongoose');
// const rjwt = require('restify-jwt-community');

const config = require('./config');

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// protect routes this way if you only have a few that you don't want to protect
//server.use(rjwt({secret: config.JWT_SECRET}).unless({path: ['/auth']})) //unless its the auth endpoint route should be protected

server.listen(config.PORT, () => {
    mongoose.set('useFindandModify', false);
    mongoose.connect(
        config.MONGODB_URI, 
        { useNewUrlParser: true }
    );
});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
    require('./routes/customers')(server);
    require('./routes/users')(server);
    console.log(`Server started on port ${config.PORT}`);
});