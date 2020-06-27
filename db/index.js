const mysql = require('mysql');

const MYSQL_HOST = 'mysql669.umbler.com';
const MYSQL_USER = 'petshop';
const MYSQL_PASS = 'petshop2015';
const MYSQL_DB = 'petshop';
const MYSQL_PORT = 41890;


exports.createCustomer = (msg, params) => {

  console.log(params);
  let resposta = {
    tipo: 'texto',
    mensagem: 'Vamos criar o cliente...',
  };
  return resposta;
};