const express = require("express");
const dbConnect = require("./config/db-connect.config");
const { notFound, errorHandler } = require("./middlewares/error-handling.middleware");
const app = express();
const dotenv = require("dotenv").config();
const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");
const blogRouter = require("./routes/blog.routes");
const prodcategoryRouter = require("./routes/prod-category.routes");
const blogcategoryRouter = require("./routes/blog-category.routes");
const brandcategoryRouter = require("./routes/brand-category.routes");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

dbConnect();

app.use(morgan('dev', ));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)
app.use('/api/prod-category', prodcategoryRouter)
app.use('/api/blog-category', blogcategoryRouter)
app.use('/api/brand-category', brandcategoryRouter)

app.use(notFound);
app.use(errorHandler);

app.listen(9000, 'localhost', (err) => {
    if (err) {
        console.log(`Error listening to PORT 9000`);
    } else {
        console.log(`Server is running at PORT 9000`);
        console.log("Press CTRL+C to end the server");
    }
})