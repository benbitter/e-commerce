import { httpServer } from "./app.js";
import { connectDB } from "./db/index.js";

const port = 3001;

connectDB().then(() => {
    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error("Error connecting to the database:", error);
});
