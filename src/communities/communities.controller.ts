import 'reflect-metadata';
import { Request, Response } from 'express';
import { CommunitiesRepo, Community } from './communities.repo';
import { inject } from 'inversify/lib/annotation/inject';
import {
	interfaces,
	controller,
	httpGet,
	request,
	response,
	httpPost,
	requestParam,
	httpDelete,
	httpPut,
} from 'inversify-express-utils';

@controller('/v1/communities')
export class CommunitiesController implements interfaces.Controller {
	constructor(
		@inject(CommunitiesRepo) private communitiesRepo: CommunitiesRepo,
	) {}

	@httpPost('/')
	private async create(@request() req: Request, @response() res: Response) {
		try {
			const community = Community.fromJson(req.body);
			const doc = await this.communitiesRepo.create(community);
			res.status(201).send(doc);
		} catch (_) {
			res.sendStatus(500);
		}
	}

	@httpGet('/:id')
	private async read(
		@requestParam('id') id: string,
		@response() res: Response,
	) {
		try {
			const data = await this.communitiesRepo.read(id);
			if (!data) {
				res.status(404).send(`Community "${id}" not found`);
			} else {
				res.send(data);
			}
		} catch (_) {
			res.sendStatus(500);
		}
	}

	@httpPut('/')
	private async update(@request() req: Request, @response() res: Response) {
		this.create(req, res);
	}

	@httpDelete('/:id')
	private async delete(
		@requestParam('id') id: string,
		@response() res: Response,
	) {
		try {
			await this.communitiesRepo.delete(id);
			res.status(200).send('Resource deleted');
		} catch {
			res.sendStatus(500);
		}
	}
}
