import { Router, Request, Response, NextFunction } from 'express';
import { CommentsService } from './comments_service';

export function CommentsRouter(comments: CommentsService): Router {
	const router = Router();
	router.get('/', (req: Request, res: Response, next: NextFunction) => {
		const data = comments.buildTree('postId');
		res.send(data);
	});
	return router;
}
