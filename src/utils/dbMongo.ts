// import mongoose from 'mongoose';
// import { SecretsManager } from "aws-sdk";


// const connectDBMongo = async (secretid:string): Promise<typeof mongoose> => {
//     const SM = new SecretsManager
//     let accessDb = JSON.parse((await SM.getSecretValue({SecretId: secretid}).promise()).SecretString || "{}") as { 
//         conexion?: string, db?: string
//     };
//     try {
//         let conexion = await mongoose.connect(accessDb.conexion+'WEBSOCKET_CONNECTIONS');
//         console.log('Connected to MongoDB');
        
//         return conexion
//     } catch (error) {
//         console.error('Failed to connect to MongoDB', error);
//         return null!;
//     }
// };

// export default connectDBMongo;