const db = require('../config/db.config.js');
const People = db.people;//mapeia usuário no banco de dados mysql
const Evento = db.evento;
const Inscricao = db.inscricao;//mapeia usuário no banco de dados mysql
var report = require('../report/index')
var pdf = require('html-pdf');
var options = { format: 'Letter' };
const Op = db.Sequelize.Op;//resposta opcional de maeamento

//APIs com GET
exports.list = (req, res) => {
	if(req.query.search){ 
    //Api: http://localhost:3003/api/subscription?search=variavel  //Lista pessoa por nome e e-mail digitado
		return Inscricao
		.findAll({ 
            include:[
                {model: People, 
                    where:{
                        [Op.or]:[
                            {nome:{[Op.like]:`%${req.query.search}%`}},
                            {email:{[Op.like]:`%${req.query.search}%`}}, 
                            {cidade:{[Op.like]:`%${req.query.search}%`}} 
                        ]  
                    },  
                    attributes:['nome','email']
                },
                {model: Evento,   
                    attributes:['titulo','data','hora','valor']
                }
            ]
		})
		.then((inscricao) => {
		  if (!inscricao) {
			  return res.status(404).send({message: 'Subscription Like Not Found'})
			}
		  return res.status(200).send(inscricao);
		}).catch((error) => res.status(400).send(error));
	}
	else if(req.params.id){
		//Api: http://localhost:3003/api/subscription/id   Lista pessoa por Id
			return Inscricao
			.findAll({ 
                where: {
                    id:req.params.id
                },
                include:[{model: People,  
                    attributes:['nome','email']
                 },
                 {model: Evento,   
                    attributes:['titulo','data','hora','valor']
                 }
             ]
            })
			.then((inscricao) => {
			if (!inscricao) {
				return res.status(404).send({
				message: 'Subscription Not Found',
				});
			}
			return res.status(200).send(inscricao);
			})
			.catch((error) => res.status(400).send(error));
		}
		else{
			//Api: http://localhost:3003/api/subscription    Lista todos
			return Inscricao
			.findAll({ 
                include:[{model: People,  
                           attributes:['nome','email']
                        },
                        {model: Evento,   
                            attributes:['titulo','data','hora','valor']
                        }
                    ]
                
            })
			.then(inscricao =>{
				res.status(200).send(inscricao)
			}).catch(error=>{
				res.status(404).send('Subscription Not found')
			})
		}	  
}

exports.pdf = (req, res) => {
	 if(req.params.id){
		//Api: http://localhost:3003/api/subscription/id   Lista pessoa por Id
			return Inscricao
			.findAll({ 
                where: {
                    id:req.params.id
                },
                include:[{model: People,  
                    attributes:['nome','email']
                 },
                 {model: Evento,   
                    attributes:['titulo','data','hora','valor']
                 }
             ]
            })
			.then((inscricao) => {
                
                const table = inscricao.map((item)=>{
                    return `<tr>
                    <td>${item.pessoa.nome?item.pessoa.nome:''}</td>
                    <td>${item.pessoa.email?item.pessoa.email:''}</td>
                    <td>${item.evento.titulo?item.evento.titulo:''}</td>
                    <td>${item.evento.local?item.evento.local:''}</td>
                    <td>${item.evento.data?item.evento.data:''}</td>
                    <td>${item.evento.hora?item.evento.hora:''}</td>
                    </tr>` 
                  }
                ).join('')//junta as informações dos itens
                const html = report.replace('{{table}}', table)
                pdf.create(html, options).toBuffer(function (err, buffer) {
                    if (err) return res.send(err);
                    res.setHeader('Content-type', 'application/pdf');
                    res.type('pdf');
                    res.end(buffer, 'binary');
                });
            })			
		}
}

//APIs com POST (Adicionar pessoa)
exports.add = (req, res) => {// Api: http://localhost:3003/api/subscription/peopleID?eventId=id
    if(req.query.userEmail && req.query.eventId){//id do usuário
        People.findOne({
            where:{
                email:req.query.userEmail
            },
        })//Cria usuario
            .then(people => {
                Evento.findById(req.query.eventId)//Cria usuario
                .then(event => {
                    var dNow = new Date();
                        dNow = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' +
                        dNow.getFullYear() + ' ' + dNow.getHours() + ':' + 
                        dNow.getMinutes();	
                        Inscricao.create({//Cria usuario
                            eventId:event.id,
                            peopleId:people.id,
                            qtd:req.body.qtd,
                            data: dNow
                        }).then(inscricao => {
                            res.status(200).send(inscricao)
                        }).catch(err => {//se erro de gravar usuário
                            res.status(500).send({ reason: err.message });
                        })
                }).catch(err => {//se erro de gravar usuário
                    res.status(500).send({ reason: err.message });
                })
            }).catch(err => {//se erro de gravar usuário
                res.status(500).send({ reason: err.message });
            })
    } else res.status(405).send('i Not Found');
}

exports.delete = (req, res) => { //Exclui pessoas
	//Api: DELETE http://localhost:3003/api/subscription/id 
    return Inscricao
      .findById(req.params.id)
      .then(inscricao => {
        if (!inscricao) {
          return res.status(400).send({
            message: 'Subscription Not Found',
          });
        }
		return inscricao
		.destroy()
          .then(() => res.status(200).send('Excluido'))
          .catch((error) => res.status(404).send(error));
      })
      .catch((error) => res.status(500).send(error));
  }