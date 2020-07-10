// init project
const express = require('express');
const app = express();
const { google } = require('googleapis');
let horarios = {
  agenda: [],
};

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.use(express.static('public'));

const calendarId = 'g60iv2cl5r96o172dbiqodttpk@group.calendar.google.com';
const { JWT } = require('google-auth-library');

const serviceAccount = {
  type: 'service_account',
  project_id: 'chatbot-whtogt',
  private_key_id: 'b82004f71aa8e52991c233cfac36ef4850f144df',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxHPKhiwo6H57/\nlUyOQCjq+QgLm6YWTzRhx6wUa1DAri/wssi+XS1Dm9fI+S1Gg9ws0owSxpSv476U\ngxm43/CKFjlep10KhdZCkcYV+rBWkdaQ+eobg0jt/hIEmSxduCvIyhgwNZOH2Oqc\nlVcQA1qZQHL1ncMDElZio8r2Bydrnm7PO2q8w9LQPz6B+jJVCD4DsGHHU7pt+6KQ\nf3K8ziPTuMYa2aror4+2SCzkjSWR94WHsE+a0PNswJ4F3au8xf11iiyVr+Wlqixj\nh4Xu4E7zZv018CRsC/ZlWmeqgD6k12yV015txvSpdNi6FUDsSauda5gY2z3A2NPE\nPvpTlH6dAgMBAAECggEAQHh5GbSzFFVOW1rNczqHqoDcHN2bp6NNPgqg6Q3nZzwA\n1209BY6FW4bvFYkeofx9uRMrSepfVWdhiE3wnwtlU96jI4ForNvrEnBd2sJWTizo\nHf3a6gjwEzHY/TOEotjXl095XpMiEOE1BaqW9o1B/WcocZ/rzMJwD5fv2X7hKpr0\n2DYWE2YA8FHBnvnJHQ3TxHDNFh5peGzz0vcL0DGAqtRbZd8UFusqCnWXJpmrlWAQ\nAjczH3zo3fr9XEo+iZBeW+sg4sMFYYmn1MdGC11IPB8QEH6IMVAT3h7ZfP4y1e3M\nRzSygL8sVzLBwfS7DdpvFnZZaFpwMo4V0gpXexQXQQKBgQD0kV1yZxE1d8ZNB13k\n1p1g5VwSpoqke1Vz3CdO4L6kIYlM1ZZW++1qJkZyoIYFPY1q5N4s8VECW1jmL4B5\nUMtx8dViTE9FRQInK4RpEHdfRLUBtim19HzzPlNpfQbloL9BFnyG5xy9zLoINBXH\nEtvUVM7OSwEzMebu3GeyxbUePwKBgQC5ZGGuD1gVdy1gNy7YUrtheO+tqKVgkAa3\nYESUakEcJra0OXmmGnAQuhORGXAua0v/061VwYl3j7uOYVtdIikpV/5Pi8g+diD3\nVAIjXW4MbTNPoqUHc1ljJnuqQzJwUo2WPTm4j+sln8l7/31cohVzLL09iq1O7Q2e\ngjHVUU+kIwKBgQDb/obYie3o8rzmPWIwnv0iVC7md/juzCKp/bc+NNxIOAKRou+B\nf0yo15U3Nz5XKG81YHqaYthEDneBV+lxN0RKUwdnTM1huhmdsn+BIta+U8eeqoYK\nrspW5BGUKmsx0882dUu+7dXkxWvyRSfx0vz7mu4Mk1uY+aKJ6qk9Hqs1cQKBgHpk\n9kQW5z1MsA1cgTXZ8NGaKQpKU9xbWcPI753YRGIUgPydEV4DCEdSwcZCuBg9SDB+\njGoYWuwvXVDTn6DuA6TC7ieQDkSGcp82vC6i6RuVIJILu84ebj4SUwSGVo9nQQiW\nJTxe74yoYDnX4+i7LVQbjlhJ7L81q48hP0so4l5nAoGBAMJG2FsFd3oGz6M5awGa\nKTRnJ8m4sVRk4Cqq9diTMBoTnUC+soY+V1kB0Yw+rbnozykgbKxr2ImxIKckpW1o\neq2DzzWMfjadPR8id6TIkF/nkUgGyvdKT6kVEGrU3XzOmiZKSVdOV0Z7RH19waMF\nmLO7dEZYtyYCNBLV8sjf1QE4\n-----END PRIVATE KEY-----\n',
  client_email: 'petshopcalendar@chatbot-whtogt.iam.gserviceaccount.com',
  client_id: '105374673978615358871',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/petshopcalendar%40chatbot-whtogt.iam.gserviceaccount.com',
};

const timeZoneOffset = '-03:00';

const serviceAccountAuth = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar',
});

const calendar = google.calendar('v3');

exports.verificaHorarioLivre = (msg, params, idzap) => {
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('verificaHorarioLivre ');
  console.log('msg: ', msg);
  console.log('params: ', params);
  console.log('idzap: ', idzap);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  let data = params.data;
  // let hora = params.body.queryResult.parameters['hora'];
  let hora = '00:00:00';

  const dateTimeStart = new Date(Date.parse(data.split('T')[0] + 'T' + '00:00:00'));

  const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 24));

  // const dateTimeStart = new Date('2020-07-08T00:00:00.000Z');
  // const dateTimeEnd = new Date('2020-07-10T00:00:00.000Z');
  console.log('+ INICIO DA PESQUISA DE H LIVRES          +');
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  // console.log('dateTimeStart: ', dateTimeStart);
  // console.log('dateTimeEnd: ', dateTimeEnd);
  // console.log('+++++++++++++++++++++++++++++++++++++++++++');

  /*
  const agendamentoString =
    formatData(new Date(data.split('T')[0])) + ' as ' + hora.split('T')[1].split('-')[0];
*/
  const agendamentoString = '12/02 as 15h';

  return getFreeAvail(dateTimeStart, dateTimeEnd)
    .then((res) => {
      // console.log('Existem eventos programados: ', res.data);
      // console.log('Horarios ocupados: ', res.data.calendars);
      var events = res.data.calendars[calendarId].busy;

      for (let i = 0; i < events.length; i++) {
        let horaStart = events[i].start.split('T')[1].substr(0, 5);
        let horaEnd = events[i].end.split('T')[1].substr(0, 5);

        let reservado = `${horaStart},${horaEnd}`;

        horarios.agenda.push({ reservado });
        console.log(`horarios[${i}]: ${horarios.agenda[i].reservado}`);
      }

      // console.log('events: ', events);
      // console.log('events[0]: ', events[0]);
      // console.log('events[0].start: ', events[0].start);

      // const dateTimeStart = new Date(Date.parse(data.split('T')[0] + 'T' + '00:00:00'));
      // console.log('events[0].start.split(T)[0]: ', events[0].start.split('T')[0]);
      //console.log('events[0].start.split(T)[1]:', events[0].start.split('T')[1]);
      // console.log('+++++++++++++++++++++++++++++++++++++++++++');

      // let horaStart = events[0].start.split('T')[1];
      // let horaEnd = events[0].end.split('T')[1];

      // console.log('events[0].end.split(T)[0]: ', events[0].end.split('T')[0]);
      // console.log('events[0].end.split(T)[1]:  ', events[0].end.split('T')[1]);
      // console.log('+++++++++++++++++++++++++++++++++++++++++++');

      console.log(horarios);
      //console.log('horaEnd:   ', horaEnd.substr(0, 5));
      console.log('+++++++++++++++++++++++++++++++++++++++++++');

      // console.log(`start: ${horaStart.substr(0, 5)}, end: ${horaEnd.substr(0, 5)}`);
      // console.log('+++++++++++++++++++++++++++++++++++++++++++');
      const horaCompleta = events[0].start.split('T')[1];
      // const horaCheia = horaCompleta.split(':')[0];
      // const horaMinuto = horaCompleta.split(':')[1];
      // console.log('horaCheia: ', horaCheia);
      // console.log('horaMinuto: ', horaMinuto);

      // const start = horaCompleta.substr(0, 5);
      // console.log('start: ', start);

      // console.log('events.length[1]: ', events.length);

      let mensagem = `Excelente, seu serviço esta agendado para ${agendamentoString} `;

      console.log('MENSAGEM DE RETORNO: ');
      console.log(mensagem);
      console.log('+++++++++++++++++++++++++++++++++++++++++++');

      let resposta = {
        tipo: 'texto',
        mensagem: mensagem,
      };
      return resposta;
    })
    .catch((error) => {
      console.log('Não existem eventos programados:', error);
      let mensagem = `Desculpe, não temos mais vaga para ${agendamentoString}.`;
      console.log(mensagem);
      let resposta = {
        tipo: 'texto',
        mensagem: mensagem,
      };
      return resposta;
    });
};

function formatData(date) {
  var nomeMes = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  var dia = date.getDate();
  var mesIndex = date.getMonth();
  var ano = date.getFullYear();

  return dia + ' ' + nomeMes[mesIndex] + ' ' + ano;
}

function getFreeAvail(dateTimeStart, dateTimeEnd) {
  return new Promise((resolve, reject) => {
    calendar.freebusy.query(
      {
        auth: serviceAccountAuth,
        headers: { 'content-type': 'application/json' },
        resource: {
          items: [{ id: calendarId, busy: 'Active' }],
          timeMin: dateTimeStart.toISOString(),
          timeMax: dateTimeEnd.toISOString(),
          timeZone: timeZoneOffset,
        },
      },
      (err, calendarResponse) => {
        err ? reject(err) : resolve(calendarResponse);
      }
    );
  });
}

exports.agendarHorario = (msg, params, idzap) => {
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('agendarHorario: ');
  console.log('msg: ', msg);
  console.log('params: ', params);
  console.log('idzap: ', idzap);
  let resposta = {
    tipo: 'texto',
    mensagem: 'Inicio do processo de agendamento.',
  };
  return resposta;
};