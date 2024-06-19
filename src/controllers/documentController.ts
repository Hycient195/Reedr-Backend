import { Request, Response } from 'express';
import DocumentView from '../models/Document';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: {
      id: string;
  };
}

export const trackDocumentView = async (req: AuthRequest, res: Response) => {
  const { documentName, lastViewedPage } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!documentName || lastViewedPage === undefined) {
    return res.status(400).json({ message: 'Document name and last viewed page are required' });
  }

  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const documentView = await DocumentView.findOneAndUpdate(
      { userId, documentName },
      { lastViewedPage },
      { new: true, upsert: true }
    );

    res.status(200).json(documentView);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getLastViewedPage = async (req: AuthRequest, res: Response) => {
  const { documentName } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!documentName) {
    return res.status(400).json({ message: 'Document name is required' });
  }

  try {
    const documentView = await DocumentView.findOne({ userId, documentName });

    if (!documentView) {
      return res.status(404).json({ message: 'No record found for this document' });
    }

    res.status(200).json({ lastViewedPage: documentView.lastViewedPage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllDocumentViews = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const documentViews = await DocumentView.find({ userId }).select('documentName lastViewedPage createdAt updatedAt');
    res.status(200).json(documentViews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};