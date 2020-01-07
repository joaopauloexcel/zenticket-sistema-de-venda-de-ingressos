module.exports = (sequelize, Sequelize) => {//simulação real da tabela users do mysql
    const Event = sequelize.define('eventos', {//passando o nome da tabela
        titulo: {
            type: Sequelize.STRING(100)//0 negado - 1 liberado
        },
        descricao: {
            type: Sequelize.STRING(100)//0 negado - 1 liberado
        },
        local: {
            type: Sequelize.STRING(100)//0 negado - 1 liberado
        },
        data: {
            type: Sequelize.STRING(30)//0 negado - 1 liberado
        },
        hora: {
            type: Sequelize.STRING(20)//0 negado - 1 liberado
        },
        valor: {
            type: Sequelize.FLOAT//0 negado - 1 liberado
        },
     },{
        timestamps: false
    });
	
	return Event;//retorna para a função o usuário criado/mapeado
}