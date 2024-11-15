import { APIGatewayEvent } from "aws-lambda";
import { initializeDatabase } from "./utils/db";
import { z } from 'zod';
import { DataSource } from "typeorm";
import { Atencion } from "./Atencion";
import { mkConfig, generateCsv } from "export-to-csv";
import { fileSender } from "./utils/fileSender";



let conexiondb: DataSource;
export const handler = async (event: APIGatewayEvent) => {
	try {
		let secretdb = process.env.SECRETDB ? process.env.SECRETDB : "";
		let response = {
			estado: "OK"
		};
		//conexion a db analitycs de betterfly
		conexiondb = await initializeDatabase(secretdb, conexiondb!);
		//los reportes diarios se envian a las 00:30 hs, por ejemplo: el reporte del dia lunes se envia a las 00:30 hs del martes
		//en horario de verano se enviaran una hora mas tarde (01:30)
		//obtengo la fecha de ayer y la formateo para la query sql 
		const today = new Date();
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() -1)
		const formattedYesterday = `${yesterday.getFullYear()}${(yesterday.getMonth() + 1).toString().padStart(2, '0')}${yesterday.getDate().toString().padStart(2, '0')}`
		//obtengo las atenciones
		let attentions = await conexiondb
			.getRepository(Atencion)
			.createQueryBuilder("atencion")
			.where("atencion.Fecha_Atencion = :fecha", { fecha: formattedYesterday })
			.getMany();
		// si hay informacion disponible, formateo los type Date ya que la libreria de CSV no convierte ese tipo a string. Si no hay informacion retorno un mensaje
		let csvData: any[] = []
		if (attentions.length) {
			const formatDateTime = (date: Date | null | undefined): string => {
				return date ? date.toISOString().replace('T', ' ').substring(0, 23) : '';
			};
			csvData = attentions.map((atencion: Atencion) => ({
				...atencion,
				Fecha_Inicio_Consulta: atencion.Fecha_Inicio_Consulta != null ? formatDateTime(atencion.Fecha_Inicio_Consulta) : null,
				Fecha_Termino_Consulta: atencion.Fecha_Termino_Consulta != null ? formatDateTime(atencion.Fecha_Termino_Consulta) : null,
				Fecha_Inicio_Llamada: atencion.Fecha_Inicio_Llamada != null ? formatDateTime(atencion.Fecha_Inicio_Llamada) : null,
				Fecha_Termino_Llamada: atencion.Fecha_Termino_Llamada != null ? formatDateTime(atencion.Fecha_Termino_Llamada) : null
			}));
		} else {
			csvData = [{
				SIN_ATENCIONES: `No se registraron atenciones en la fecha: ${formattedYesterday}`
			}]
			console.log('CSVDATA: ', csvData)
		}

		//CSV GENERATOR
		let filename = `atenciones_${formattedYesterday}`
		const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: filename });
		const csvFile = generateCsv(csvConfig)(csvData)

		//conexion y envio de archivo CSV a SFTP de betterfly
		await fileSender(csvFile, filename)
		return genResponse(200, response);
	} catch (e) {
		let statusCode = 500;
		let response = {
			estado: "NOK",
			codeStatus: statusCode
		};
		if (e instanceof z.ZodError) {
			statusCode = 400;
		} else if (e instanceof HttpError) {
			statusCode = e.statusCode;
		}
		console.log("error", e);
		response.codeStatus = statusCode;
		return genResponse(statusCode, response);
	}

}

class HttpError extends Error {
	constructor(public statusCode: number, message: string) {
		super(message);
	}
}


let genResponse = (statusCode: number, objResponse: Object) => {
	return {
		statusCode: statusCode,
		body: JSON.stringify(objResponse),
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
		}
	};
}


// let secretdbmongo = process.env.SECRETDBMONGO? process.env.SECRETDBMONGO: "";
//console.log("event", event);
//get param in event
//ejemplo de validacion de objeto de la request mediante zod
// const request = z.object({
//   atencionId: z.string().transform((val:string)=>val ? parseInt(val) : 0).refine(val => val >= 1),
//   userId: z.string()
// }).parse(event.queryStringParameters);
//example error
//throw new HttpError(400,"No se encontro la atencion");