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
	requestParam,
} from 'inversify-express-utils';
import faker from '@faker-js/faker';

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
			res.sendStatus(500);
		}
	}

	@httpGet('/:id')
	private async getById(
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

	@httpPost('/')
	private async create(@request() req: Request, @response() res: Response) {
		try {
			const name = faker.animal.type();
			const doc = new Community(name);
			const data = await this.communitiesRepo.create(doc);
			res.status(201).send(data);
		} catch (_) {
			res.sendStatus(500);
		}
	}
}
