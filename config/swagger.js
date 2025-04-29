// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'Simple CRUD API with JWT Auth'
    },
    servers: [
      {
        url: 'http://localhost:5000/swagger',
      },
    ],
  },
  apis: ['./routes/*.js'], // path to your router file(s)
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
