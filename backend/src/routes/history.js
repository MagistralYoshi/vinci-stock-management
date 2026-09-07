import express from 'express';
import * as historyController from '../controllers/historyController.js';

const router = express.Router();

// Routes pour l'historique
router.get('/', historyController.getHistory);
router.get('/item/:itemId', historyController.getItemHistory);
router.post('/action', historyController.recordAction);

export default router;
