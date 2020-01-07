var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const db = require('./app/config/db.config.js');
const controllerInitiation = require('./app/controller/controllerInitiation');
const cors = require('cors')
app.use(cors());

app.use(bodyParser.json())
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'content-type');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');next();//Se ocorreu tudo certo aqui, passa pra próxima função (next funciona como um bit de trava para a função ser executada primeiro e evitar o callback)
});

db.sequelize.sync({force: false}).then(() => {
	console.log('Drop and Resync with { force: false }');
});

const loginRouter = require('./app/routers/loginRouter');
const peopleRouter = require('./app/routers/peopleRouter');
const eventRouter = require('./app/routers/eventRouter');
const subscriptionRouter = require('./app/routers/subscriptionRoter');

app.use('/api/login', loginRouter);
app.use('/api/people', peopleRouter);
app.use('/api/event', eventRouter);
app.use('/api/subscription', subscriptionRouter);

var server = app.listen(3003, ()=> {
	var host = server.address().address
	var port = server.address().port
	setTimeout(()=>{
		controllerInitiation.firstPeople()
	},2000)
	console.log("App listening at http://%s:%s", host, port)
})

module.exports = app;