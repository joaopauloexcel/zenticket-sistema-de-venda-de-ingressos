module.exports = (sequelize, Sequelize) => {//simulação real da tabela users do mysql
    const Inscricao = sequelize.define('inscricoes', {//passando o nome da tabela
        eventId: {
            type: Sequelize.INTEGER,
            references: {         // User hasMany WorkingDays n:n
              model: 'eventos',
              key: 'id'
            }
		  },
        peopleId: {
            type: Sequelize.INTEGER,
            references: {         // User hasMany WorkingDays n:n
              model: 'pessoas',
              key: 'id'
            }
		  },
        data: {
            type: Sequelize.STRING(20)//0 negado - 1 liberado
        },
        qtd: {
            type: Sequelize.STRING(30)//0 negado - 1 liberado
        }
    },{
        timestamps: false
    });
	
	return Inscricao;//retorna para a função o usuário criado/mapeado
}