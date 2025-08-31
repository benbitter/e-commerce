import { httpServer } from "./app.js";
import { connectDB } from "./db/index.js";
import { seedProduct } from "./seed/Product.js";
import { seedBrand } from "./seed/Brand.js";
import { seedCategory } from "./seed/Category.js";

const port = process.env.PORT || 3001;

connectDB().then(async () => {
    // await seedProduct();
    // await seedBrand();
    // await seedCategory();
    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error("Error connecting to the database:", error);
});
