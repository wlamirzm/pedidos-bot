const express = require('express');
const bodyParser = require('body-parser');

const Model = require('./model');
const Db = require('./db');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Olá Chatbot');
});

app.post('/webhook', async (req, res) => {
  const body = req.body;
  const queryResult = body.queryResult;
  // const contexto = body.queryResult.outputContexts[0];

  const nomeContexto = body.queryResult.outputContexts[0].name;
  const outupParameters = body.queryResult.outputContexts[0].parameters;

  const mensagem = req.body.queryResult.queryText;
  const intencao = req.body.queryResult.intent.displayName;
  const parametros = req.body.queryResult.parameters;

  let responder = '';
  let idZap = '';
  let cartaoNumero = '';
  let contexto = '';

  if (req.body.queryResult.outputContexts[1].parameters) {
    idZap = req.body.queryResult.outputContexts[1].parameters.twilio_sender_id;
  }

  if (req.body.queryResult.outputContexts[0].parameters && idZap) {
    cartaoNumero = req.body.queryResult.outputContexts[0].parameters.contexto.cartao;
    console.log('Pesquisa do cartaoNumero: ', cartaoNumero);
    console.log('+++++++++++++++++++++++++++++++++++++++++++');
  }

  // console.log('body: ', body);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');
  // console.log('queryResult: ', queryResult);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');
  // console.log('outupParameters: ', outupParameters.contexto.cartao);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('nomeContexto: ', nomeContexto);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('cartaoNumero: ', cartaoNumero);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('idZap: ', idZap);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  if (cartaoNumero == '' && idZap) {
    console.log('contexto carregado: ', contexto);
    console.log('+++++++++++++++++++++++++++++++++++++++++++');
    contexto = Model.carregaCliente(mensagem, parametros, idZap);
  }

  switch (intencao) {
    case '999.teste':
      resposta = await Model.verCardapio(mensagem, parametros);
      break;
    case 'verStatus':
      resposta = Model.verificaClienteZap(mensagem, parametros, idZap);
      break;
    case 'tipoPagamento':
      console.log('Intenção: tipoPagamento');
      resposta = Db.createCustomer(mensagem, parametros);
      break;
    case 'verHorario':
      console.log('Intenção: ver_horario');
      resposta = Model.verHorario(mensagem, parametros);
      break;
    case '000.Default':
      console.log('Intenção: 000.Default');
      resposta = Model.verDefault(mensagem, parametros, idZap);
      break;
    default:
      resposta = { tipo: 'texto', mensagem: 'Sinto muito, não entendi o que você quer' };
  }

  if (resposta.tipo == 'texto') {
    console.log('contexto: ', contexto);
    if (contexto) {
      responder = {
        fulfillmentText: 'Resposta do Webhook',
        fulfillmentMessages: [
          {
            text: {
              text: [resposta.mensagem],
            },
          },
        ],
        outputContexts: [
          {
            name: nomeContexto,
            lifespanCount: 5,
            parameters: contexto,
          },
        ],
      };
    } else {
      responder = {
        fulfillmentText: 'Resposta do Webhook',
        fulfillmentMessages: [
          {
            text: {
              text: [resposta.mensagem],
            },
          },
        ],
      };
    }
  } else if (resposta.tipo == 'imagem') {
    responder = {
      fulfillmentText: 'Resposta do Webhook',
      fulfillmentMessages: [
        {
          image: {
            imageUri: resposta.url,
          },
        },
      ],
      source: '',
    };
  } else if (resposta.tipo == 'card') {
    let meuCardapio = [];
    let menuItem = {};

    for (let i = 0; i < resposta.cardapio.length; i++) {
      menuItem = {
        card: {
          title: resposta.cardapio[i].titulo,
          subtitle: resposta.cardapio[i].preco,
          imageUri: resposta.cardapio[i].url,
        },
      };
      meuCardapio.push(menuItem);
    }
    responder = {
      fulfillmentText: 'Resposta do Webhook',
      fulfillmentMessages: meuCardapio,
      source: '',
    };
  }

  console.log('resposta final', responder);

  res.send(responder);
});

const porta = process.env.PORT || 8080;
const hostname = '127.0.0.1';

app.listen(porta, () => {
  console.log(`servidor rodando em http://${hostname}:${porta}`);
});

// app.get('/pergunta', (req, res) => {
//   msg=req.query.pergunta;
//   res.send("você perguntou: " + msg);
// })

// app.get('/mensagem/:tipo/:id', (req, res) => {
//   msg=req.params.tipo;
//   cod=req.params.id;
//   res.send("você quer editar o id #" + cod);
// })

// app.post('/pedido', (req, res) => {
//   console.log(req);
//   const produto = req.body.produto;
//   const qtd = req.body.quantidade;
//   const pagto = req.body.tipoPagamento;
//   const bebida = req.body.bebida;

//   const pedido = {
//     produto,
//     qtd,
//     pagto,
//     bebida
//   }

//   res.json(pedido);
// })
