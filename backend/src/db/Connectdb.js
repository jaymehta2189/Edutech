// import mysql2 from 'mysql2/promise';
// const Connectdb=async ()=>{
//     try{
//         const pool =  mysql2.createPool({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_NAME
//         });
//         const connection= await pool.getConnection();
//         console.log("Database connected successfully");
//         return connection;
//     }catch(error){
//         console.error("Database connection failed:", error);
//         throw error;
//     }
// }

import mongoose from "mongoose";

const Connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

export default Connectdb;