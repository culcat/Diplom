import express from "express";
import * as db from '../Controllers/Services'

const router = express.Router()

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags:
 *       - Services
 *     responses:
 *       200:
 *         description: Returns all feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedback:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       price:
 *                         type: string
 *                       img:
 *                         type: string
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags:
 *       - Services
 *     requestBody:
 *       description: Service details to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the service
 *                 example: "Cleaning Service"
 *               price:
 *                 type: number
 *                 description: Price of the service
 *                 example: 99.99
 *               icon:
 *                 type: string
 *                 description: Icon URL of the service
 *                 example: "http://example.com/icon.png"
 *     responses:
 *       200:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     icon:
 *                       type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/services:
 *   delete:
 *     summary: Delete a service
 *     tags:
 *       - Services
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the service to be deleted
 *         example: 1
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     img:
 *                       type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

router.get('/services',
    async (req: express.Request, res: express.Response) => {
        try {
            const services = await db.showServices();
            res.status(200).json({ services });
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    });

router.delete('/services',
    async (req: express.Request, res: express.Response) => {
        try {
            const services = await db.deleteService(Number(req.query.id));
            res.status(200).json({ services });
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    });

router.post('/services',
    async (req: express.Request, res: express.Response) => {
        try {
            const services = await db.createService(req.body.name,req.body.price,req.body.icon);
            res.status(200).json({ services });
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    });

export default router;