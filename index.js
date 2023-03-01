const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const authRouter = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

dbConnect();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser());

app.use('/api/user', authRouter);

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