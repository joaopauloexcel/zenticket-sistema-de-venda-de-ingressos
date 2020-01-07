const db = require('../config/db.config.js');
const People = db.people;//mapeia usuário no banco de dados mysql
var bcrypt = require('bcryptjs');

exports.firstPeople = () => {
	People.findById(1)
			.then(people => {
				if(people)
					return console.log('já existe usuário master')
			    else{
					People.create({
						id: 1,
						nome: "Admin",
						email:"admin@admin.com",
						senha: bcrypt.hashSync('123456', 8),//"", senha é criptografada
						permissao: '3'//3- Master, 2-funcionarios, 1-Clientes
					}).then(people => {
						console.log('Gerou usuário Master - Ok.')
					}).catch(err => {//se erro de gravar usuário
						return
					})
		     	}
			})
			.catch((error) => {return});
}
