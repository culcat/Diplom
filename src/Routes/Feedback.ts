import express from "express";
import * as db from '../Controllers/Feedback'

const router = express.Router()
/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedback
 *     tags:
 *       - Feedback
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
 *                       user_id:
 *                         type: string
 *                       message:
 *                         type: string
 *   post:
 *     summary: Create a new feedback
 *     tags:
 *       - Feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback created successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a feedback
 *     tags:
 *       - Feedback
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the feedback to delete
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */

router.get('/feedback',
    async (req: express.Request, res: express.Response) => {
        try {
            const feedbacks = await db.showFeedback();
            res.status(200).json({ feedbacks });
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    });

router.post('/feedback', async (req: express.Request, res: express.Response) => {
    try {
        const { user_id, message } = req.body;
        if (!user_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await db.createFeedback(user_id, message);
        res.status(200).json({message:'create'})
    }catch(err: any) {
        res.status(500).send({error: err.message})
    }
})

router.delete('/feedback', async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await db.deleteFeedback(Number(id));
        res.status(200).json({message:'delete'})
    }catch(err: any) {
        res.status(500).send({error: err.message})
    }
})

export default router;
