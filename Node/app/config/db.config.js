const env = require('./env.js');//env recebe conexão com o banco de dados
 
const Sequelize = require('sequelize');//mapeia banco de dados do mysql
const sequelize = new Sequelize(env.database, env.username, env.password, {//instancia Sequelize
  host: env.host,//conecta no host e demais informações advindas do env
  dialect: env.dialect,
  operatorsAliases: false, 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});
 
const db = {};//declaração do simulador do banco de dados
 
db.Sequelize = Sequelize;//injeta no objeto db a biblioteca sequelize
db.sequelize = sequelize;//injeta no objeto db a conexão do banco Mysql vinda do env.js

db.people = require('../model/people.model')(sequelize, Sequelize);
db.evento = require('../model/event.model')(sequelize, Sequelize);
db.inscricao = require('../model/subscription.model')(sequelize, Sequelize);

db.inscricao.belongsTo(db.people, {foreignKey: 'peopleId'})
db.inscricao.belongsTo(db.evento, {foreignKey: 'eventId'})

module.exports = db;