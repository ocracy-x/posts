import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { CommunitiesRepo, Community } from './communities.repo';

import { inject } from 'inversify/lib/annotation/inject';
import {
	interfaces,
	controller,
	httpGet,
	request,
	response,
	httpPost,
	queryParam,
} from 'inversify-express-utils';

@controller('/v1/communities')
export class CommunitiesController implements interfaces.Controller {
	constructor(
		@inject(CommunitiesRepo) private communitiesRepo: CommunitiesRepo,
	) {}

	@httpGet('/')
	private async get(@request() req: Request, @response() res: Response) {
		try {
			const data = await this.communitiesRepo.getAll();
			res.send(data);
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@httpPost('/')
	private async create(@request() req: Request, @response() res: Response) {
		try {
			const doc = new Community('hello');
			const data = await this.communitiesRepo.create(doc);
			res.status(201).send(data);
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@httpGet('/paginate')
	private async paginate(
		@queryParam('start') start: number,
		@queryParam('count') count: number,
		@response() res: Response,
	) {
		const str = `start=${start}, count=${count}`;
		res.status(201).send(str);
	}
}
