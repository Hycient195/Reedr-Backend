import { Schema, model, Document } from 'mongoose';

interface IDocumentView extends Document {
  userId: string|any;
  documentName: string;
  lastViewedPage: number;
}

const documentViewSchema = new Schema<IDocumentView>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  documentName: { type: String, required: true },
  lastViewedPage: { type: Number, required: true },
}, { timestamps: true });

const DocumentView = model<IDocumentView>('DocumentView', documentViewSchema);

export default DocumentView;