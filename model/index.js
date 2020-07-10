const axios = require('axios');

exports.verCardapio = async (msg, params, prtos) => {
  let url = 'https://sheetdb.io/api/v1/uvscf0tab9ti1';
  let cardapio = [];
  let content = {};
  let produto = {};
  let retorno = {};

  return await axios
    .get(url)
    .then((resultado) => {
      retorno = resultado.data;

      for (let i = 0; i < retorno.length; i++) {
        produto = {
          titulo: `Cod: ${retorno[i].Codigo} - ${retorno[i].Nome}`,
          preco: `R$ ${retorno[i].Preco}`,
          url: retorno[i].Imagem,
        };

        cardapio.push(produto);
      }

      let resposta = {
        tipo: 'card',
        cardapio,
      };

      return resposta;
    })
    .catch((err) => console.log(err));
};

exports.verificaClienteZap = async (msg, params, idzap) => {
  let url = 'https://sheetdb.io/api/v1/tj0u37oaq5w7k';
  let nome = {};
  let fone = {};
  let email = {};
  let cartao = {};
  let zap = {};

  return await axios
    .get(url)
    .then((resultado) => {
      retorno = resultado.data;
      let contexto = {
        contexto: {
          nome: retorno[0].NOME,
          fone: retorno[0].FONE,
          email: retorno[0].EMAIL,
          cartao: retorno[0].CARTAO,
          zap: retorno[0].WHATSAPP,
        },
      };
      return contexto;
    })
    .catch((err) => console.log(err));
};

exports.verificaCliente = (msg, params, idzap) => {
  console.log('msg: ', msg);
  console.log('params: ', params);
  console.log('idzap: ', idzap);

  if (params) {
    if ('contexto' in params) {
      console.log('contexto encontrado');
      let resposta = {
        tipo: 'texto',
        mensagem:
          '[ nome ]: ' +
          params.contexto.nome +
          ' [ fone ]: ' +
          params.contexto.fone +
          ' [ email ]: ' +
          params.contexto.email +
          ' [ cartao ]: ' +
          params.contexto.cartao +
          ' [ cpf ]: ' +
          params.contexto.cpf +
          ' [ zap ]: ' +
          params.contexto.zap,
      };
      return resposta;
    }
    console.log('contexto não encontrado');
    let resposta = {
      tipo: 'texto',
      mensagem: 'Os dados de contexto não foram encontrados.',
    };
    return resposta;

  } else {
    console.log('parametros  não encontrado');
    let resposta = {
      tipo: 'texto',
      mensagem: 'Os dados dos parametros não foram encontrados.',
    };
    return resposta;
  }
};

exports.verStatus = (msg, params, idzap) => {
  let resposta = {
    tipo: 'texto',
    mensagem: 'Calma que já estamos preparando o seu pedido',
  };
  return resposta;
};

exports.carregaCliente = async (msg, params, idzap) => {
  let url = 'https://sheet.best/api/sheets/32716db2-497f-493d-9a72-a5b6d3820919/WHATSAPP/' + idzap;
  console.log('url: ', url);
  let nome = {};
  let fone = {};
  let email = {};
  let cartao = {};
  let cpf = {};
  // let zap = {};

  return await axios
    .get(url)
    .then((resultado) => {
      retorno = resultado.data;
      let contexto = {
        contexto: {
          nome: retorno[0].NOME,
          fone: retorno[0].FONE,
          email: retorno[0].EMAIL,
          cartao: retorno[0].CARTAO,
          cpf: retorno[0].CPF,
          zap: retorno[0].WHATSAPP,
        },
      };
      // console.log('contexto: ', contexto);
      return contexto;
    })
    .catch((err) => console.log(err));
  return contexto;
};

exports.verHorario = (msg, params) => {
  // console.log('params: ', params);
  let resposta = {
    tipo: 'texto',
    mensagem: 'Nosso horário de funcionamento é de segunda a sexta-feira, das 08:00 ás 19:00 horas',
  };

  return resposta;
};

exports.verDefault = (msg, params, idzap) => {
  // console.log('params: ', params);
  let contexto = {
    contexto: {
      nome: 'José da Silva',
      fone: '11999991234',
      email: 'jose@email.com',
      cartao: '1234556789012',
      cpf: '46555415045',
      zap: 'whatsapp:+11999991234',
    },
  };
  // console.log('contexto: ', contexto);
  return contexto;
};
