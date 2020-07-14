const express = require('express');
const bodyParser = require('body-parser');

const Model = require('./model');
const Db = require('./db');
const Calendar = require('./calendar');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  const parametros = req.body.queryResult.outputContexts[0].parameters;

  let responder = '';
  let idZap = '';
  let cartao = '';
  let cpf = '';
  let contexto = [];
  let contextoCliente = [];

  // console.log('req.body.queryResult.outputContexts[0]: ', req.body.queryResult.outputContexts[0]);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');

  if (req.body.queryResult.outputContexts[1].parameters) {
    idZap = req.body.queryResult.outputContexts[1].parameters.twilio_sender_id;
  }

  if (req.body.queryResult.outputContexts[0].parameters) {
    const contexto = req.body.queryResult.outputContexts[0].parameters.contexto;
  }
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('+ INICIO DO Webhook                       +');
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  console.log('PARAMETROS: ', parametros);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  if (parametros) {
    if ('contexto' in parametros) {
      nome = parametros.contexto.nome;
      fone = parametros.contexto.fone;
      email = parametros.contexto.email;
      cartao = parametros.contexto.cartao;
      cpf = parametros.contexto.cpf;
      zap = parametros.contexto.zap;

      console.log('DADOS CARREGADOS DO CONTEXTO DO DIALOGFLOW');
      console.log('+++++++++++++++++++++++++++++++++++++++++++');
      console.log('nome: ', nome);
      console.log('fone: ', fone);
      console.log('email: ', email);
      console.log('cartao: ', cartao);
      console.log('cpf: ', cpf);
      console.log('zap: ', zap);
      console.log('+++++++++++++++++++++++++++++++++++++++++++');
    }
  } else {
    console.log('Sem parametros carregados.');
    console.log('+++++++++++++++++++++++++++++++++++++++++++');
  }

  //if (req.body.queryResult.outputContexts[0].parameters && idZap) {
  //  cartaoNumero = req.body.queryResult.outputContexts[0].parameters.contexto.//cartao;
  //  // console.log('Pesquisa do cartaoNumero: ', cartaoNumero);
  //  // console.log('+++++++++++++++++++++++++++++++++++++++++++');
  //}

  // console.log('body: ', body);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');
  // console.log('parametros: ', parametros);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('req.body.queryResult.outputContexts[1]: ', req.body.queryResult.outputContexts[1]);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  // console.log('queryResult: ', queryResult);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');

  // console.log('outupParameters: ', outupParameters.contexto.cartao);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');
  // console.log('nomeContexto: ', nomeContexto);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('+ CARTÃO:  ', cartao);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  // console.log('idZap: ', idZap);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');

  if (cartao == '' && idZap) {
    contextoCliente = await Model.carregaCliente(mensagem, parametros, idZap);
    console.log('contextoCliente carregado: ', contextoCliente);
    console.log('+++++++++++++++++++++++++++++++++++++++++++');
  }

  switch (intencao) {
    case '999.teste':
      resposta = await Model.verCardapio(mensagem, parametros);
      break;
    case '997.usuario':
      resposta = Model.verificaCliente(mensagem, parametros, idZap);
      break;
    case '996.horarioLivre':
      resposta = Calendar.verificaHorarioLivre(mensagem, parametros, idZap);
      break;
    case '995.agendarHorario - yes':
      resposta = await Calendar.verificaHorarioLivre(mensagem, parametros, idZap);
      break;
    case '995.agendaConsulta':
      resposta = await Calendar.agendaConsulta(mensagem, parametros, idZap);
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
    case '998.CarregaFake':
      console.log('Intenção: 998.CarregaFake');
      contextoCliente = Model.verDefault(mensagem, parametros, idZap);
      resposta = Model.verHorario(mensagem, parametros);
      break;
    default:
      resposta = { tipo: 'texto', mensagem: 'Sinto muito, não entendi o que você quer' };
  }
  console.log('resposta: ', resposta);
  if (resposta.tipo == 'texto') {
    'contexto' in contextoCliente
      ? console.log('contexto detected')
      : console.log('contexto missing');

    // console.log('contextoCliente.contexto: ', contextoCliente.contexto);
    // console.log('contextoCliente.contexto.length: ', contextoCliente.contexto.length);
    if ('contexto' in contextoCliente) {
      responder = {
        fulfillmentText: resposta.mensagem,
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
            parameters: contextoCliente,
          },
        ],
      };
    } else {
      responder = {
        fulfillmentText: resposta.mensagem,
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

  console.log('resposta final: ', responder);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  res.send(responder);
});

const porta = process.env.PORT || 8080;
const hostname = '127.0.0.1';

app.listen(porta, () => {
  console.log(`servidor rodando em http://${hostname}:${porta}`);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
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
