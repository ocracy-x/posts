import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
	controller,
	httpGet,
	httpPost,
	interfaces,
	queryParam,
	requestParam,
	request,
	response,
	httpDelete,
} from 'inversify-express-utils';
import 'reflect-metadata';
import { Profile, ProfilesRepo } from './profiles.repo';

@controller('/v1/profiles')
export class ProfilesController implements interfaces.Controller {
	constructor(@inject(ProfilesRepo) private profilesRepo: ProfilesRepo) {}

	@httpGet('/all')
	private async getAll(@response() res: Response) {
		try {
			const docs = await this.profilesRepo.getAll();
			res.send(docs);
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@httpPost('/')
	private async create(
		@queryParam('username') username: string,
		@response() res: Response,
	) {
		try {
			const profile = await this.profilesRepo.create(new Profile({ username }));
			if (profile) {
				res.status(201).send(profile);
			} else {
				res.status(400).send('Username already exists');
			}
		} catch (err) {
			console.log(err);
			res.status(500).send(JSON.stringify(err));
		}
	}

	@httpGet('/:id')
	private async read(
		@requestParam('id') id: string,
		@response() res: Response,
	) {
		try {
			const profile = await this.profilesRepo.read(id);
			if (!profile) {
				res.sendStatus(404);
			} else {
				res.send(profile);
			}
		} catch (err: any) {
			res.status(500).send();
		}
	}

	@httpDelete('/:id')
	private async delete(
		@requestParam('id') id: string,
		@response() res: Response,
	) {
		try {
			await this.profilesRepo.delete(id);
			res.send(200);
		} catch (err) {
			res.status(500).send();
		}
	}
}
