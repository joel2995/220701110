const express = require("express");
const logger = require("./middleware/logger");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const shorturlRoutes = require('./routes/shorturlRoutes');


dbConnect();

const app= express();

app.use(express.json());
app.use(logger);
app.use('/', shorturlRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




