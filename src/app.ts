import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import container from './inversify';
import { CommentsRouter } from './comments/comments_controller';
import { CommentsService } from './comments/comments_service';

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

const commentsService = container.get<CommentsService>(CommentsService);
const commentsRouter = CommentsRouter(commentsService);
app.use('/comments', commentsRouter);

export default app;
