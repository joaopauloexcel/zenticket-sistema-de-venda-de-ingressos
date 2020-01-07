const express = require('express')
const router = express();
const controllerEvent = require('../controller/controllerEvent');//controller recebe todo o arquivo do controlador js que contém o endpoint de cadastro e e acesso do usuário no sistema
const cors = require('cors')

    router.options('/:id', cors()); // habilita pre-flight request para DELETE e PUT request, saber mais em: https://medium.com/@alexandremjacques/entendendo-o-cors-parte-2-e4172d6da206 

	router.get('/:id?', /*[authJwt.verifyToken]*/ controllerEvent.list);
	router.post('/', controllerEvent.add);
	router.put('/:id', cors(), controllerEvent.update);
	router.delete('/:id', cors(), controllerEvent.delete);

module.exports = router;