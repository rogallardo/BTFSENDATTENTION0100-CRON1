
import { exit } from 'process';
import * as fs from 'fs';
let events:any = {};
function setEnvs(path:string, defaultEnv: any = {}) {
  let envs = defaultEnv;
  try{
    let [listA,listB] = path.split("json/"); 
    listA = listA + "json";
    // navegar por un json mediante una una lista de strings concatenadas por "."
    let obj = JSON.parse(fs.readFileSync(listA).toString());
    let list = listB.split(".");
    for(let i = 0; i<list.length; i++){
        obj = obj[list[i]];
    }
    envs = obj;
  }catch(e){console.log("se cargara default enviroments")}
    console.log("ENVIROMENTS",envs);
    for (let key in envs) {
      process.env[key] = envs[key];
    }
}
function setEvento(path:string, defaultEnv: any = {}) {
  try{
  events = JSON.parse(fs.readFileSync(path).toString());
  return;
  }catch(e){console.log("se cargara default EVENTO")}
  events = defaultEnv;
}

setEnvs("./../terraform_endpoints/estructure.json/*.sendMessage.config_for_stage.dev.env_variables",{
  "keyenv":"valueenv"
});
setEvento("./events_test/test_local.json",{
  "queryStringParameters": {
        "userId": "user123"
      },
      "Headers": {
        "content-type": "application/json",
        "Authorization": "Bearer <token>"
      },
      "body": "deafault body"
});

// Cargar el evento de prueba simula llamada de endpoint
console.log("EVENTO:", events);

const AWS = require('aws-sdk');

// Configura la región
AWS.config.update({region: 'us-east-1'});

import { handler } from './src/index';






// Función para emular la llamada al handler
async function testHandler() {
  try {
    let insert:any = {...events}
    const result = await handler(insert!); // Usamos 'as any' para evitar problemas de tipado
    console.log("Resultado:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
console.log("########### INICIA LAMBDA ###########");
// Ejecutar la prueba
testHandler().then(() => {
  console.log("########### FIN LAMBDA ###########");
  exit(0)}).catch(() => {
    console.log("########### FIN LAMBDA FAIL ###########");
    exit(1)});