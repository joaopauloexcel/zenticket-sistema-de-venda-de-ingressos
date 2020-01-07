const express = require('express')
const router = express();
const verifySignUp = require('./securityAuth/verifyPeople');//importa export do arquivo de análise de usuário duplicado verifySignUp.js
const controllerPeople = require('../controller/controllerPeople');//controller recebe todo o arquivo do controlador js que contém o endpoint de cadastro e e acesso do usuário no sistema
const cors = require('cors')

    router.options('/:id', cors()); // habilita pre-flight request para DELETE e PUT request, saber mais em: https://medium.com/@alexandremjacques/entendendo-o-cors-parte-2-e4172d6da206 

	router.get('/:id?', /*[authJwt.verifyToken]*/ controllerPeople.list);
	router.post('/', [verifySignUp.checkDuplicateEmail], controllerPeople.add);
	router.put('/:id', cors(), [verifySignUp.checkDuplicateEmail], controllerPeople.update);
	router.delete('/:id', cors(), controllerPeople.delete);

module.exports = router;