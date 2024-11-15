import { Buffer } from "node:buffer";
import Client from 'ssh2-sftp-client';
import {asString } from "export-to-csv";
import { SecretsManager } from "aws-sdk";

export const fileSender = async(file: any, filename: string)=>{
    console.log('fileSender ejecutandose')
    let sftp = new Client();
    const SM = new SecretsManager
    let accessSFTP = JSON.parse((await SM.getSecretValue({SecretId: process.env.SFTPCONNECT!}).promise()).SecretString || "{}") as 
    { host: string, port: string, username: string, password: string };
    const optionsConection = {
        host: accessSFTP.host,
        port: parseInt(accessSFTP.port),
        username: accessSFTP.username,
        password: accessSFTP.password
    }
    const remotePath = `eventos/${filename}.csv`
    try {
        console.log('conectando a sftp')
        const conection = await sftp.connect(optionsConection)
        console.log('conexion establecida a sftp') 
        console.log('Enviando archivo...')
        await sftp.put(Buffer.from(asString(file)), remotePath)
        console.log(`Archivo enviado exitosamente bajo el nombre: ${filename}`)
    } catch (error: Error | any) {
        console.log(error.message)
        throw error
    } finally {
        console.log('finalizado')
        await sftp.end();
    }
}