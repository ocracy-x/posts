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
			const prev = await this.communitiesRepo.read(community.name);
			if (prev) {
				res.status(400).send('Community already exists');
			} else {
				const next = await this.communitiesRepo.create(community);
				res.status(201).send(next);
			}
		} catch (err) {
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
