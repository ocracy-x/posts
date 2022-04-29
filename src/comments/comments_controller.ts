import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { CommentsService } from './comments_service';
import { inject } from 'inversify';
import {
	interfaces,
	controller,
	httpGet,
	request,
	response,
} from 'inversify-express-utils';

@controller('/comments')
export class CommentsController implements interfaces.Controller {
	constructor(
		@inject(CommentsService) private commentsService: CommentsService,
	) {}

	@httpGet('/')
	public async get(@request() req: Request, @response() res: Response) {
		try {
			const tree = this.commentsService.buildTree('');
			res.send(tree);
		} catch (err) {
			res.status(500).send(err);
		}
	}
}
