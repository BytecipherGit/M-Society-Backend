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


// .env Config
require("dotenv").config();

app.use(express.static(path.join(__dirname, 'public')));
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
require("./routes/superAdmin")(app);
require("./routes/designation")(app);
require("./routes/society")(app);
require("./routes/residentialUser")(app);
require("./routes/phoneBook")(app);
require("./routes/notice")(app);
require("./routes/complaints.router")(app);

// Swagger integration
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MySociety API with Swagger",
            version: "0.1.0",
            description:
                "This is a API documentation for MySociety application made with Express and documented with Swagger",
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
