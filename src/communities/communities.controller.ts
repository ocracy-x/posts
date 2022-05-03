import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { CommunitiesRepo } from './communities.repo';

import {
	interfaces,
	controller,
	httpGet,
	request,
	response,
} from 'inversify-express-utils';
import { inject } from 'inversify/lib/annotation/inject';

@controller('/v1/communities')
export class CommunitiesController implements interfaces.Controller {
	constructor(
		@inject(CommunitiesRepo) private communitiesRepo: CommunitiesRepo,
	) {}

	@httpGet('/')
	public async get(@request() req: Request, @response() res: Response) {
		try {
			const data = await this.communitiesRepo.getAll();
			res.send(data);
		} catch (err) {
			res.status(500).send(err);
		}
	}
}
