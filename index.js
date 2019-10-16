// Comentário para testar o diff do git
const express = require('express');

const server = express();

//indicar para o server que vamos trabalhar com json
server.use(express.json());

// Qual a porta que vai ser executada
server.listen(3000);

// 1- Query params = ?teste=1

// server.get('/teste', (req, res) => {
//   const nome = req.query.nome;

//   return res.json({message: `Hello World ${nome}` });
// });

// 2- Route params = /users/1

// server.get('/users/:id', (req, res) => {
// //const id = req.params.id; //opção 1
// const { id } = req.params; //opção 2


//   return res.json({message: `Buscado usuário ${id}` });
// });

// 3- Requiest body = { "name": "Glauber". "email": "glauberabc@gmail.com"}

// CRUD - Create, Read, Update, Delete

const users = ['Gustavo', 'Arthur', 'Thais'];

// Middlewares
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

// VERIFICA SE A TAG EXISTE DENTRO DO JSON
// ESSA FUNCAO É PASSADA NA CHAMADA DAS ROTAS E SÃO EXECUTADAS ANTES
function checkNameExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({error: 'User name is required'});
  }

  return next();
}

// VERIFICA SE EXISTE ALGUM USUARIO NO INDEX
// SE NÃO EXISTIR RETORNA ERRO E NÃO DEIXA SEGUIR A ROTAS
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user)
    return res.status(400).json({error: 'User does not exists'});

    req.user = user;

  return next();
}

// RETORNA TODOS OS USUÁRIOS
server.get('/users', (req, res) => {
  return res.json(users);
})

//RETORNA O USUÁRIO DO INDEX INDICADO NA RODA DA URL
server.get('/users/:index', checkUserInArray, (req, res) => {
  //const id = req.params.id; //opção 1
  //const { index } = req.params; //opção 2  
  
    return res.json(req.user);
  });

// CRIA UM NOVO USUÁRIO PASSADO NO BODY VIA JSON
server.post('/users', checkNameExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// ALTERA O USUÁRIO DO INDEX PELO VALOR PASSADO NO BODY
server.put('/users/:index', checkNameExists, checkUserInArray, (req, res) => {
  const {index} = req.params;
  const {name} = req.body;

  users[index] = name;

  return res.json(users);
});

// DELETE USUARIO
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const {index} = req.params;

  users.splice(index, 1);

  return res.send();
});