// init project
const express = require('express');
const app = express();
const { google } = require('googleapis');

let horarioOcc = {
  agenda: [],
};

let horarioLivre = new Array('');

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
// const calendarId = 'ksndv59hcefogutnu741c5uh08@group.calendar.google.com';
const { JWT } = require('google-auth-library');
const { stringify } = require('actions-on-google/dist/common');
const { analytics } = require('googleapis/build/src/apis/analytics');

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
const startTime = '08:00';
const endTime = '20:00';

const startIntervalo = '12:00';
const endIntervalo = '14:00';

const serviceAccountAuth = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar',
});

const calendar = google.calendar('v3');

exports.agendaConsulta = (msg, params, idzap) => {
  console.log('AGENDAMENTO-YES ACIONADO');
  let cliente = 'A definir';
  let tipo = 'Consulta';
  let servico = 'Consulta médica';
  let data = params.data;
  let dataHora = params.dateTime;
  // let hora = params.horario;
  // console.log('hora processada:');
  // console.log(data.split('T')[0] + 'T' + data.split('T')[1].split('-')[0] + timeZoneOffset);

  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log(dataHora);
  console.log(dataHora.split('T')[1]);
  console.log(dataHora.split('T')[1].split('-')[0]);
  console.log(dataHora.split('T')[1].split('-')[0].split(':')[0]);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  let hora = dataHora.split('T')[1].split('-')[0].split(':')[0];

  /*
  let hora = new Date(
    Date.parse(data.split('T')[0] + 'T' + data.split('T')[1].split('-')[0] + timeZoneOffset)
  );
  */
  console.log('cliente: ', cliente);
  console.log('tipo: ', tipo);
  console.log('servico: ', servico);
  console.log('data: ', data);
  console.log('hora: ', hora);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  // loadClient();
  // authenticate();

  const dateTimeStart = new Date(Date.parse(data.split('T')[0] + 'T' + hora + ':00'));
  const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));

  // const dateTimeStart = new Date(
  //   Date.parse(data.split('T')[0] + 'T' + hora.split('T')[1].split('-')[0] + timeZoneOffset)
  // );
  // const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));

  const agendamentoString = formatData(new Date(dateTimeStart)) + ' ás ' + hora + ' horas';

  console.log('dateTimeStart: ', dateTimeStart);
  console.log('dateTimeEnd: ', dateTimeEnd);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  return criarEventoCalendario(dateTimeStart, dateTimeEnd, servico, tipo, cliente)
    .then(() => {
      let mensagem = `Excelente, seu serviço esta agendado para ${agendamentoString} `;
      console.log(mensagem);
      let resposta = {
        tipo: 'texto',
        mensagem: mensagem,
      };
      return resposta;
    })
    .catch(() => {
      let mensagem = `Desculpe, não temos mais vaga para ${agendamentoString}.`;
      console.log(mensagem);
      let resposta = {
        tipo: 'texto',
        mensagem: mensagem,
      };
      return resposta;
    });
};

exports.verificaHorarioLivre = (msg, params, idzap) => {
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log('verificaHorarioLivre ');
  console.log('msg: ', msg);
  console.log('params: ', params);
  console.log('idzap: ', idzap);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  let data = params.data;
  let hora = '00:00:00';
  horarioLivre = [];
  const dateTimeStart = new Date(Date.parse(data.split('T')[0] + 'T' + '00:00:00'));

  const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 24));

  console.log('+ INICIO DA PESQUISA DE H LIVRES          +');
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  console.log('dateTimeStart: ', dateTimeStart);
  console.log('dateTimeEnd: ', dateTimeEnd);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');

  const agendamentoString = '12/02 as 15h';

  return getFreeAvail(dateTimeStart, dateTimeEnd)
    .then((res) => {
      var events = res.data.calendars[calendarId].busy;
      for (let i = 0; i < events.length; i++) {
        let horaStart = events[i].start.split('T')[1].substr(0, 5);
        let horaEnd = events[i].end.split('T')[1].substr(0, 5);
        horarioOcc.agenda[i] = {
          start: horaStart,
          end: horaEnd,
        };
      }
      itemLivre = 0;
      itemOcupado = 0;
      horarioLivreStart = startTime;
      horarioLivreEnd = '';

      if (compararHora(startIntervalo, '00:00') && compararHora(endIntervalo, '00:00')) {
        horarioOcc.agenda[horarioOcc.agenda.length] = {
          start: startIntervalo,
          end: endIntervalo,
        };
      }

      const horarioOcupado = horarioOcc.agenda.sort(
        (a, b) =>
          a.start.split(':')[0] * 60 +
          a.start.split(':')[1] -
          (b.start.split(':')[0] * 60 + b.start.split(':')[1])
      );

      // console.log('horarioOcc(sort): ', horarioOcc);

      // console.log('horarioOcupado: ', horarioOcupado);
      horarioLivre = [];
      if (horarioOcupado.length == 0) {
        horarioLivre[0] = {
          start: startTime,
          end: endTime,
        };
      } else {
        for (let itemOcupado = 0; itemOcupado < horarioOcupado.length; itemOcupado++) {
          if (compararHora(horarioOcupado[itemOcupado].start, horarioLivreStart)) {
            if (compararHora(endTime, horarioOcupado[itemOcupado].start)) {
              horarioLivre[itemLivre] = {
                start: horarioLivreStart,
                end: horarioOcupado[itemOcupado].start,
              };
              itemLivre += 1;
            } else {
              horarioLivre[itemLivre] = {
                start: horarioLivreStart,
                end: endTime,
              };
              itemLivre += 1;
            }
          }
          if (compararHora(horarioOcupado[itemOcupado].end, startTime)) {
            if (compararHora(endTime, horarioOcupado[itemOcupado].end)) {
              horarioLivreStart = horarioOcupado[itemOcupado].end;
              if (itemOcupado === horarioOcupado.length - 1) {
                horarioLivre[itemLivre] = {
                  start: horarioLivreStart,
                  end: endTime,
                };
                itemLivre += 1;
              }
            }
          }
        }
      }

      console.log('horarioOcupado: ', horarioOcupado);
      console.log('+++++++++++++++++++++++++++++++++++++++++++');

      console.log('horarioLivre: ', horarioLivre);
      console.log('+++++++++++++++++++++++++++++++++++++++++++');
      let horarioLivreConsulta = '';
      let acc = 0;
      console.log('horarioLivre.length: ', horarioLivre.length);
      console.log('+++++++++++++++++++++++++++++++++++++++++++');

      for (let i = 0; i < horarioLivre.length; i++) {
        let horaStart = horarioLivre[i].start.split(':')[0].substr(0, 2);
        let horaEnd = horarioLivre[i].end.split(':')[0].substr(0, 2);
        console.log('horaStart: ', horaStart);
        console.log('horaEnd: ', horaEnd);

        for (let j = horaStart; j < horaEnd; j++) {
          acc += 1;
          horarioLivreConsulta = `${horarioLivreConsulta} [${j}:00] \n`;
          // console.log('horarioLivreConsulta: ', horarioLivreConsulta);
        }
      }
      let mensagem = '';
      if (horarioLivreConsulta.length > 8) {
        mensagem = `Temos os horários livres abaixo:\n${horarioLivreConsulta} \n`;
      } else {
        let mensagem = `Temos o horário livre abaixo:\n${horarioLivreConsulta} \n`;
      }
      mensagem = `${mensagem} Para qual horário você quer agendar? \n`;

      console.log('+++++++++++++++++++++++++++++++++++++++++++');
      console.log('horarioLivreConsulta.length: ', horarioLivreConsulta.length);

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

// Verifica se hora1 é maior que hora2.
function compararHora(hora1, hora2) {
  hora1 = hora1.split(':');
  hora2 = hora2.split(':');

  var d = new Date();
  var data1 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hora1[0], hora1[1]);
  var data2 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hora2[0], hora2[1]);

  return data1 > data2;
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

function criarEventoCalendario(dateTimeStart, dateTimeEnd, servico, tipo, cliente) {
  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        auth: serviceAccountAuth, // List events for time period
        calendarId: calendarId,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString(),
        timeZone: timeZoneOffset,
      },
      (err, calendarResponse) => {
        // Check if there is a event already on the Calendar
        if (err || calendarResponse.data.items.length > 0) {
          reject(err || new Error('Requisição conflita com outros agendamentos'));
        } else {
          // Create event for the requested time period
          calendar.events.insert(
            {
              auth: serviceAccountAuth,
              calendarId: calendarId,
              resource: {
                summary: servico + '-' + tipo + '-',
                description: '[' + cliente + '][' + servico + '][' + tipo + ']',
                start: { dateTime: dateTimeStart },
                end: { dateTime: dateTimeEnd },
              },
            },
            (err, event) => {
              err ? reject(err) : resolve(event);
            }
          );
        }
      }
    );
  });
}
