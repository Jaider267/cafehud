import dotenv from 'dotenv-safe';
import joi from 'joi';
import path from 'path';

const __dirname = process.cwd();
const envFileName = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

// Cargar y validar variables de entorno
dotenv.config({
  allowEmptyValues: false,
  path: path.join(__dirname, envFileName),
  example: path.join(__dirname, '.env.example')
});

const envSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().default(3000),
  MONGODB_URI: joi.string().required(),
  JWT_SECRET: joi.string().min(32).required(),
  JWT_EXPIRES_IN: joi.string().default('7d'),
  CORS_ORIGIN: joi.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: joi.number().default(900000), // 15 minutos
  RATE_LIMIT_MAX_REQUESTS: joi.number().default(100),
  LOG_LEVEL: joi.string().valid('error', 'warn', 'info', 'debug').default('info')
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  console.error('❌ Error en variables de entorno:', error.details[0].message);
  process.exit(1);
}

export const config = {
  nodeEnv: value.NODE_ENV,
  port: value.PORT,
  mongodbUri: value.MONGODB_URI,
  jwtSecret: value.JWT_SECRET,
  jwtExpiresIn: value.JWT_EXPIRES_IN,
  corsOrigin: value.CORS_ORIGIN,
  rateLimit: {
    windowMs: value.RATE_LIMIT_WINDOW_MS,
    maxRequests: value.RATE_LIMIT_MAX_REQUESTS
  },
  logLevel: value.LOG_LEVEL
};