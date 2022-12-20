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

// const Nexmo = require('nexmo');
// const nexmo = new Nexmo({
//     apiKey: "y3FYwyOGYbiOeCyC",
//     apiSecret: "xTsGrbgy2hzdInGH5p1XSH9r5LQMmlM9tJpqzXaPhbmOmusLdb"
// });

// nexmo.message.sendSms(
//     "9329736361", '9329736361', 'hii',
//     (err, responseData) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(responseData);
//         }
//     }
// );

// app.post('/send', (req, res) => {
//     // Send SMS
//     console.log("38");
//     nexmo.message.sendSms(
//         '9329736361', '9329736361', "hii", { type: 'unicode' },
//         (err, responseData) => { if (responseData) { console.log("responseData") } else {console.log(err);} }
//     );
// });

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
require("./routes/superAdmin.router")(app);
require("./routes/designation.router")(app);
require("./routes/society.router")(app);
require("./routes/residentialUser.router")(app);
require("./routes/phoneDirectory.router")(app);
require("./routes/notice.router")(app);
require("./routes/complaints.router")(app);
require("./routes/document.router")(app);

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
