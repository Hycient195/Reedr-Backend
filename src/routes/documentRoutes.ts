import { Router } from 'express';
import { getAllDocumentViews, getLastViewedPage, trackDocumentView } from '../controllers/documentController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/track-view', authMiddleware, trackDocumentView);
router.get('/last-viewed-page/:documentName', authMiddleware, getLastViewedPage);
router.get('/all-documents', authMiddleware, getAllDocumentViews);


export default router;