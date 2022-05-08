import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
	controller,
	httpGet,
	httpPost,
	interfaces,
	request,
	requestParam,
	response,
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

	@httpGet('/:id')
	private async read(@requestParam() id: string, @response() res: Response) {
		try {
			const profile = await this.profilesRepo.read(id);
			if (!profile) {
				res.sendStatus(404);
			} else {
				res.send(profile);
			}
		} catch (err) {
			res.send(500).send(err);
		}
	}
}
