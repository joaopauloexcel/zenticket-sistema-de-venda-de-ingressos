const db = require('../config/db.config.js');
const Evento = db.evento;//mapeia usuário no banco de dados mysql

const Op = db.Sequelize.Op;//resposta opcional de maeamento

//APIs com GET
exports.list = (req, res) => {
	if(req.query.search){ 
    //Api: http://localhost:3003/api/event?search=variavel  //Lista pessoa por nome e e-mail digitado
		return Evento
		.findAll({ 
			where: {
				[Op.or]:[
					{titulo:{[Op.like]:`%${req.query.search}%`}},
                    {descricao:{[Op.like]:`%${req.query.search}%`}},
                    {data:{[Op.like]:`%${req.query.search}%`}},
                    {hora:{[Op.like]:`%${req.query.search}%`}},
                    {local:{[Op.like]:`%${req.query.search}%`}}
				],
			},
			order: [['data', 'DESC']],
		})
		.then((event) => {
		  if (!event) {
			  return res.status(404).send({message: 'Event Like Not Found'})
			}
		  return res.status(200).send(event);
		}).catch((error) => res.status(400).send(error));
	}
	else if(req.params.id){
		//Api: http://localhost:3003/api/event/id   Lista pessoa por Id
			return Evento
			.findById(req.params.id)
			.then((event) => {
			if (!event) {
				return res.status(404).send({
				message: 'Event Not Found',
				});
			}
			return res.status(200).send(event);
			})
			.catch((error) => res.status(400).send(error));
		}
		else{
			//Api: http://localhost:3003/api/event    Lista todos
			return Evento
			.findAll()
			.then(event =>{
				res.status(200).send(event)
			}).catch(error=>{
				res.status(404).send('Event Not found')
			})
		}	  
}

//APIs com POST (Adicionar pessoa)
exports.add = (req, res) => { // API http://localhost:3003/api/event com Body {"titulo":""} 
    Evento.create({//Cria usuario
        titulo:req.body.titulo,
        descricao: req.body.descricao,
        data:req.body.data,
        local:req.body.local,
        hora: req.body.hora,
        valor: req.body.valor
    }).then(event => {
        res.status(200).send(event)
    }).catch(err => {//se erro de gravar usuário
        res.status(500).send({ reason: err.message });
    })

}

exports.update = (req, res) => {//Altera de pessoas
    //Api: PUT  http://localhost:3003/api/event/id
    if(req.params.id){//id do usuário
        Evento.findById(req.params.id)//Cria usuario
            .then(evento => {
                evento.update({//Cria usuario
                        titulo:req.body.titulo,
                        descricao: req.body.descricao,
                        data:req.body.data,
                        local:req.body.local,
                        hora: req.body.hora,
                        valor: req.body.valor
                    }).then(event => {
                        res.status(200).send(event)
                    }).catch(err => {//se erro de gravar usuário
                        res.status(500).send({ reason: err.message });
                    })
            }).catch(err => {//se erro de gravar usuário
                res.status(500).send({ reason: err.message });
            })
    } return
}

exports.delete = (req, res) => { //Exclui pessoas
	//Api: DELETE http://localhost:3003/api/event/id 
    return Evento
      .findById(req.params.id)
      .then(event => {
        if (!event) {
          return res.status(400).send({
            message: 'Event Not Found',
          });
        }
		return event
		.destroy()
          .then(() => res.status(200).send('Excluido'))
          .catch((error) => res.status(404).send(error));
      })
      .catch((error) => res.status(500).send(error));
  }