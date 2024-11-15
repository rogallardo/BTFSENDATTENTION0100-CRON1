import { SecretsManager } from "aws-sdk";
import { BaseEntity, DataSource } from "typeorm";
import { Atencion } from "../Atencion";

export const AppDataSource = ({DB_HOST,DB_PORT,DB_USERNAME,DB_PASSWORD, DB_DATABASE}:{DB_HOST:string,DB_PORT:number,DB_USERNAME:string,DB_PASSWORD:string, DB_DATABASE:string},entities:any[])=>
    new DataSource({
    type: "mssql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'Analytics',
    entities: entities,
    schema: "dbo"
});

export async function initializeDatabase(secretid:string, connectionA:DataSource|null|undefined): Promise<DataSource> {
    const SM = new SecretsManager
    let accessDb = JSON.parse((await SM.getSecretValue({SecretId: secretid}).promise()).SecretString || "{}") as { username?: string, password?: string, engine?: string, host?: string, port?: string, dbname?: string };
    let connection;
    if(connectionA){
        connection = connectionA;    
    }else{
        connection = AppDataSource({
            DB_HOST: accessDb.host?? '',
            DB_PORT: Number(accessDb.port?? 0),
            DB_USERNAME: accessDb.username?? '',
            DB_PASSWORD: accessDb.password?? '',
            DB_DATABASE: accessDb.dbname?? ''
        }, [Atencion]);
    }
    try {
        console.log("Initializing Data Source...");
        console.log("connection.isInitialized", connection.isInitialized);
        if(connection.isInitialized)
            return connection;
        await connection.initialize();
        console.log("connection.isInitialized", connection.isInitialized);
        console.log("Data Source has been initialized!");
    } catch (err) {
        console.error("Error during Data Source initialization", err);
    }
    return connection;
}
