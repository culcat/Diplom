import express from "express";
import { showTruck,createTruck,deleteTruck } from '../Controllers/Trucks';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trucks
 *   description: Truck management
 */

/**
 * @swagger
 * /api/trucks:
 *   get:
 *     summary: Get trucks by type
 *     description: Retrieve a list of trucks based on the provided type query parameter.
 *     tags: [Trucks]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *         required: true
 *         description: The type of trucks to retrieve.
 *     responses:
 *       200:
 *         description: A list of trucks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trucks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       type:
 *                         type: integer
 *                       model:
 *                         type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Type query parameter is required
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error message
 */

/**
 * @swagger
 * /api/trucks:
 *   post:
 *     summary: Create a new truck
 *     description: Create a new truck with the specified details.
 *     tags: [Trucks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               load_capacity:
 *                 type: number
 *               Length:
 *                 type: number
 *               Height:
 *                 type: number
 *               Volume:
 *                 type: number
 *               type_id:
 *                 type: integer
 *               Brand:
 *                 type: string
 *               experience:
 *                 type: number
 *               img:
 *                 type: string
 *     responses:
 *       200:
 *         description: Truck created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trucks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       load_capacity:
 *                         type: number
 *                       Length:
 *                         type: number
 *                       Height:
 *                         type: number
 *                       Volume:
 *                         type: number
 *                       type_id:
 *                         type: number
 *                       Brand:
 *                         type: number
 *                       experience:
 *                         type: number
 *                       img:
 *                         type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid request body
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error message
 */

/**
 * @swagger
 * /api/trucks:
 *   delete:
 *     summary: Delete a truck by ID
 *     description: Delete a truck based on the provided ID query parameter.
 *     tags: [Trucks]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the truck to delete.
 *     responses:
 *       200:
 *         description: Truck deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trucks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       type:
 *                         type: integer
 *                       model:
 *                         type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID query parameter is required
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.get('/trucks', async (req: express.Request, res: express.Response) => {
    const type = req.query.type;
    if (!type) {
        return res.status(400).json({ error: 'Type header parameter is required' });
    }

    try {
        const trucks = await showTruck(Number(type));
        res.status(200).json({ trucks });
    } catch (err: any) {
        res.status(500).send({ error: err.message });
    }
});

router.delete('/trucks', async (req: express.Request, res: express.Response) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: 'ID query parameter is required' });
    }

    try {
        const trucks = await deleteTruck(Number(id));
        res.status(200).json({ trucks });
    } catch (err: any) {
        res.status(500).send({ error: err.message });
    }
})
router.post('/trucks', async (req: express.Request, res: express.Response) => {
    try {
        const trucks = await createTruck(req.body.load_capacity,req.body.Length,req.body.Height,req.body.Volume,req.body.type_id,req.body.Brand,req.body.experience,req.body.img);
        res.status(200).json({ trucks });
    } catch (err: any) {
        res.status(500).send({ error: err.message });
    }
})

export default router;
