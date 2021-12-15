require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const authRouter=require('./routes/auth')
const jobsRouter=require('./routes/jobs')
const connectDB=require('./db/connect')
const authenticate=require('./middleware/authentication')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//security modules
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const swaggerui=require('swagger-ui-express')
const YAML=require('yamljs')
const swaggerDoc=YAML.load('./swagger.yaml')

app.use(express.json());
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());


// routes
app.get('/', (req, res) => {
  res.send(`<h1>JOBS API</h1><a href="/api-Docs">DOCUMENTATION<a>`);
});

app.use('/api-Docs',swaggerui.serve,swaggerui.setup(swaggerDoc))
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticate,jobsRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.DB_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
