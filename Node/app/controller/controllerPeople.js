const db = require('../config/db.config.js');
const People = db.people;//mapeia usuário no banco de dados mysql

const Op = db.Sequelize.Op;//resposta opcional de maeamento

var bcrypt = require('bcryptjs');

//APIs com GET
exports.list = (req, res) => {
	if(req.query.role){ 
		//Api: http://localhost:3003/api/people?search=variavel  //Lista pessoa por nome e e-mail digitado
			return People
			.findAll({ 
				where: {
					[Op.or]:[
						{permissao:{[Op.like]:`%${req.query.role}%`}},
					],
				},
				order: [['nome', 'ASC']]
			})
			.then((people) => {
			  if (!people) {
				  return res.status(404).send({message: 'People Like Not Found'})
				}
			  return res.status(200).send(people);
			}).catch((error) => res.status(400).send(error));
		}
	else if(req.query.search){ 
    //Api: http://localhost:3003/api/people?search=variavel  //Lista pessoa por nome e e-mail digitado
		return People
		.findAll({ 
			where: {
				[Op.or]:[
					{nome:{[Op.like]:`%${req.query.search}%`}},
					{email:{[Op.like]:`%${req.query.search}%`}},
					{cidade:{[Op.like]:`%${req.query.search}%`}}
				],
			},
			order: [['nome', 'ASC']]
		})
		.then((people) => {
		  if (!people) {
			  return res.status(404).send({message: 'People Like Not Found'})
			}
		  return res.status(200).send(people);
		}).catch((error) => res.status(400).send(error));
	}
	else if(req.params.id){
		//Api: http://localhost:3003/api/people/id   Lista pessoa por Id
			return People
			.findById(req.params.id)
			.then((people) => {
			if (!people) {
				return res.status(404).send({
				message: 'People Not Found',
				});
			}
			return res.status(200).send(people);
			})
			.catch((error) => res.status(400).send(error));
		}
		else{
			//Api: http://localhost:3003/api/people    Lista todos
			return People
			.findAll()
			.then(peoples =>{
				res.status(200).send(peoples)
			}).catch(error=>{
				res.status(404).send('Peoples Not found')
			})
		}	  
}

//APIs com POST (Adicionar pessoa)
exports.add = (req, res) => {//cadastro de pessoas
	//Api: POST http://localhost:3003/api/people   
	People.create({//Cria usuario
			nome: req.body.nome,//nome recebe o que foi passado na requisição
			email: req.body.email,
			rua: req.body.rua,
			cep: req.body.cep,
			estado: req.body.estado,
			numero: req.body.numero,
			complemento: req.body.complemento,
			bairro: req.body.bairro,
			cidade: req.body.cidade,
			permissao:req.body.permissao,
			senha: bcrypt.hashSync(req.body.senha, 8)
		}).then(people => {
			res.status(200).send({ message: 'Registered successfully!' });	
		}).catch(err => {//se erro de gravar usuário
			res.status(501).send({ reason: err.message });
		})
}

exports.update = (req, res) => {//Altera de pessoas
	//Api: PUT  http://localhost:3003/api/people/id
	People.findById(req.params.id)
      .then(people => {
	   people.update({//Cria usuario
		nome: req.body.nome,//nome recebe o que foi passado na requisição
		email: req.body.email,
		rua: req.body.rua,
		cep: req.body.cep,
		estado: req.body.estado,
		numero: req.body.numero,
		complemento: req.body.complemento,
		bairro: req.body.bairro,
		cidade: req.body.cidade,
		permissao:req.body.permissao,
		senha: bcrypt.hashSync(req.body.senha, 8)
	}).then(people => {
		res.status(200).send({ message: 'Registered successfully!' });
	}).catch(err => {//se erro de gravar usuário
		res.status(500).send({ reason: err.message });
	})
 })
}

exports.delete = (req, res) => { //Exclui pessoas
	//Api: DELETE http://localhost:3003/api/people/id 
    return People
      .findById(req.params.id)
      .then(people => {
        if (!people) {
          return res.status(400).send({
            message: 'People Not Found',
          });
        }
		return people
		.destroy()
          .then(() => res.status(200).send('Excluido'))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  }