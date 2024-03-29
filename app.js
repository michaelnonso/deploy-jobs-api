require('dotenv').config();
const connectDB = require("./db/connect")
require('express-async-errors');

//extra security packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

//swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')


const authMiddleware = require("./middleware/authentication")
const express = require('express');
const app = express();
const authRouter = require("./routes/auth")
const jobsRouter = require("./routes/jobs")


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.set('trust proxy',1) //application sits behind a reverse proxy
// app.use(rateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// }))
app.use(helmet())
app.use(cors())
app.use(xss())


// Doc routes
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocument));



// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs',authMiddleware,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
