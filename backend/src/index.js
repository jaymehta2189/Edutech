import app from "./app.js";
import "dotenv/config";
import Connectdb from "./db/Connectdb.js";
const PORT = process.env.PORT || 5000;
Connectdb().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error)=>{
    console.error("Database connection failed:", error);
    process.exit(1);
})