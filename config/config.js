const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
// const envVarsSchema = Joi.object({
//   NODE_ENV: Joi.string()
//     .allow(['development', 'production', 'test', 'provision'])
//     .default('development'),
//   PORT: Joi.number()
//     .default(4040),
//   MONGOOSE_DEBUG: Joi.boolean()
//     .when('NODE_ENV', {
//       is: Joi.string().equal('development'),
//       then: Joi.boolean().default(true),
//       otherwise: Joi.boolean().default(false)
//     }),
//   JWT_SECRET: Joi.string().required()
//     .description('JWT Secret required to sign'),
//   MONGO_HOST: Joi.string().required()
//     .description('Mongo DB host url'),
//   MONGO_PORT: Joi.number()
//     .default(27017)
// }).unknown()
//   .required();

const envVarsSchema = Joi.object({
    env: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('development'),
    port: Joi.number()
        .default(4040),
    mongooseDebug: Joi.boolean()
        .when('env', {
            is: Joi.string().equal('development'),
            then: Joi.boolean().default(true),
            otherwise: Joi.boolean().default(false)
        }),
    jwtSecret: Joi.string().required()
        .description('JWT Secret required to sign'),
    mongo: {
        host: Joi.string().required()
            .description('Mongo DB host url'),
        port: Joi.number()
            .default(27017)
    }
}).unknown()
    .required();

let config = {};
if (process.env.NODE_ENV === 'production') {
    config = {
        env: envVars.NODE_ENV,
        port: envVars.PORT,
        mongooseDebug: envVars.MONGOOSE_DEBUG,
        jwtSecret: envVars.JWT_SECRET,
        mongo: {
            host: envVars.MONGO_HOST,
            port: envVars.MONGO_PORT
        }
    };
}
else {
    // Offer development variables
    config = require('./development.json');
}

const { error, value: envVars } = Joi.validate(config, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = config;
