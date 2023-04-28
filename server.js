const express = require("express");
const cors = require("cors");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const path = require("path");
const helper = require('./helpers/helper');
global.__basedir = __dirname + "/";
global.locale = helper.getLocaleMessages();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Authorization", "token");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// .env Config
require("dotenv").config();

//for image fetch 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/logo')));
app.use(express.static(path.join(__dirname, 'public/uploads/complaint')));
app.use(express.static(path.join(__dirname, 'public/uploads/admin')));
app.use(express.static(path.join(__dirname, 'public/uploads/guard')));
app.use(express.static(path.join(__dirname, 'public/uploads/document')));
app.use(express.static(path.join(__dirname, 'public/uploads/notice')));
app.use(express.static(path.join(__dirname, 'public/uploads/user')));
app.use(express.static(path.join(__dirname, 'public/uploads/society')));
app.use(express.static(path.join(__dirname, 'public/uploads/serviceProvider')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to MySociety application." });
});

// mongoDB connection
mongoose
    .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB", err));

//Routes
require("./routes/superAdmin.router")(app);
require("./routes/designation.router")(app);
require("./routes/society.router")(app);
require("./routes/residentialUser.router")(app);
require("./routes/phoneDirectory.router")(app);
require("./routes/notice.router")(app);
require("./routes/complaints.router")(app);
require("./routes/document.router")(app);
require("./routes/societyAdmin.router")(app);
require("./routes/subscription.router")(app);
require("./routes/maintance.router")(app);
require("./routes/guard.router")(app);
require("./routes/profession.router")(app);
require("./routes/visiter.router")(app);
require("./routes/serviceProvider.router")(app);
require("./routes/payment.router")(app);
require("./routes/serviceSubscription.router")(app);
require("./routes/serviceproviderPay.router")(app);


//for cronJob
// require("./cronJob")

// Swagger integration
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "M-Society API with Swagger",
            version: "0.1.0",
            description:
                "This is a API documentation for M-Society application made with Express and documented with Swagger",
        },
        servers: [
            {
                url: process.env.API_URL
            },
        ],
        components: {
            securitySchemes: {
                apiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: "Authorization",
                    bearerFormat: "JWT",
                }
            }
        },
        security: [{
            apiKeyAuth: []
        }]
    },
    apis: ["./routes/*.js"],
};
const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
