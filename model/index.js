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

//

exports.verStatus = (msg, params, idzap) => {
  let resposta = {
    tipo: 'texto',
    mensagem: 'Calma que já estamos preparando o seu pedido',
  };
  return resposta;
};

exports.carregaCliente = (msg, params, idzap) => {
  let contexto = {
    contexto: {
      nome: 'Wlamir',
      fone: '(11) 99999-1234',
      email: 'wlamirzm@gmail.com',
      cartao: '123456789-11',
      zap: idzap,
    },
  };
  return contexto;
};

exports.verHorario = (msg, params) => {
  let resposta = {
    tipo: 'texto',
    mensagem: 'Nosso horário de funcionamento é de segunda a sexta-feira, das 08:00 ás 19:00 horas',
  };

  exports.verDefault = (msg, params, idzap) => {
    if (idzap == '') {
      let resposta = {
        tipo: 'texto',
        mensagem:
          'Nosso horário de funcionamento é de segunda a sexta-feira, das 08:00 ás 19:00 horas',
      };
    } else {
      let resposta = {
        tipo: 'texto',
        mensagem:
          'Olá Wlamir, nosso horário de funcionamento é de segunda a sexta-feira, das 08:00 ás 19:00 horas',
      };
    }
  };

  return resposta;
};
