module.exports = (sequelize, Sequelize) => {//simulação real da tabela users do mysql
	const People = sequelize.define('pessoas', {//passando o nome da tabela
	  nome: {
		  type: Sequelize.STRING(50)//Definindo tipo do atributo da tabela
	  },
	  email: {
		type: Sequelize.STRING(50)//Definindo tipo do atributo da tabela
	  },
	  rua: {
		  type: Sequelize.STRING(80)//Definindo tipo do atributo da tabela
	  },
	  numero: {
		type: Sequelize.STRING(10)//Definindo tipo do atributo da tabela
	  },
	  bairro: {
		type: Sequelize.STRING(80)//Definindo tipo do atributo da tabela
	  },
	  complemento: {
		type: Sequelize.STRING(50)//Definindo tipo do atributo da tabela
	  },
	  cidade: {
		type: Sequelize.STRING(50)//Definindo tipo do atributo da tabela
	  },
	  estado: {
		type: Sequelize.STRING(2)//Definindo tipo do atributo da tabela
	  },
	  cep: {
		type: Sequelize.STRING(15)//Definindo tipo do atributo da tabela rrr
	  },
	  senha: {
	    type: Sequelize.STRING(100)//Definindo tipo do atributo da tabela
	  },
	  permissao: {
	    type: Sequelize.STRING(1)//Definindo tipo do atributo da tabela
	  }
	});
	
	return People;//retorna para a função o usuário criado/mapeado
}