const express = require('express');
const router = express.Router();
const middleware = require('../middleware/jwt');
const controller = require('../controller/controller');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for the backend routes',
    },
    servers: [
        {
            url: 'http://localhost:3000', // Replace with your server URL
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: [__filename], // Use this file for Swagger annotations
};

const swaggerSpec = swaggerJsdoc(options);

// Swagger UI route
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User registered successfully
 */
router.post("/register", controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/auth/login", controller.login);

/**
 * @swagger
 * /find:
 *   get:
 *     summary: Find user details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 */
router.get("/find", middleware, controller.find);

/**
 * @swagger
 * /update:
 *   put:
 *     summary: Update user details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the user
 *               email:
 *                 type: string
 *                 description: The updated email of the user
 *               password:
 *                 type: string
 *                 description: The updated password of the user
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User details updated successfully
 */

router.put("/update", middleware, controller.update);

/**
 * @swagger
 * /terminate:
 *   delete:
 *     summary: Terminate a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User terminated successfully
 */
router.delete("/terminate", middleware, controller.terminate);

module.exports = router;