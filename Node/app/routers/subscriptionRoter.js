const express = require('express')
const router = express();
const controllerSub = require('../controller/controllerSubscription');//controller recebe todo o arquivo do controlador js que contém o endpoint de cadastro e e acesso do usuário no sistema
const cors = require('cors')

    router.options('/:id', cors()); // habilita pre-flight request para DELETE e PUT request, saber mais em: https://medium.com/@alexandremjacques/entendendo-o-cors-parte-2-e4172d6da206 

	router.get('/:id?', /*[authJwt.verifyToken]*/ controllerSub.list);
	router.get('/report/:id', controllerSub.pdf);
	router.post('/', controllerSub.add);
	router.delete('/:id', cors(), controllerSub.delete);

module.exports = router;