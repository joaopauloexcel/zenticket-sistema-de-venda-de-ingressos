const db = require('../../config/db.config.js');//carrega configurações do banco de dados
const Category = db.category;//declara conexão com o banco de dados com a tabela de usuários
const Op = db.Sequelize.Op;//Operadores do sequelize

checkDuplicatePostDescricao = (req, res, next) => {// -> Verifica se usuário existe no banco de dados
    // -> Senão, se o usuário tiver o login pelo email, verifica se o campo email já existe no banco de dados
    Category.findOne({//Tenta encontrar usuário
        where: {//onde
            descricao: req.body.descricao,//email do banco de dados corresponde ao e-mail da requisição enviada da aplicação web tentando o cadastro			
        }
    }).then(category => {//faça
        if (category) {//se houver usuário já cadastrado com esse email
            res.status(400).send("Fail -> Description is already in use!");//retorna mensagem 
            return;
        }

        next();//caso contrário, passa para a próxima função
    });
}

checkDuplicateDescricao = (req, res, next) => {// -> Verifica se usuário existe no banco de dados
		// -> Senão, se o usuário tiver o login pelo email, verifica se o campo email já existe no banco de dados
		Category.findOne({//Tenta encontrar usuário
			where: {//onde
				descricao: req.body.descricao,//email do banco de dados corresponde ao e-mail da requisição enviada da aplicação web tentando o cadastro
				id:{[Op.ne]: req.body.id}				
			}
		}).then(category => {//faça
			if (category) {//se houver usuário já cadastrado com esse email
				res.status(400).send("Fail -> Description is already in use!");//retorna mensagem 
				return;
			}

			next();//caso contrário, passa para a próxima função
		});
}

const signUpVerify = {};//declaração e instanciação da variável objeto que verificará se usuário já está logado
signUpVerify.checkDuplicateDescricao = checkDuplicateDescricao;//novo atributo do objeto que recebe a verificação do usuário
signUpVerify.checkDuplicatePostDescricao = checkDuplicatePostDescricao

module.exports = signUpVerify;//exportação da variável de verificação usuário/FUNÇÃO para outros arquivos dentro do projeto