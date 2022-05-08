import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
	controller,
	httpGet,
	interfaces,
	request,
	response,
} from 'inversify-express-utils';
import 'reflect-metadata';
import { ProfilesRepo } from './profiles.repo';

@controller('/v1/profiles')
export class ProfilesController implements interfaces.Controller {
	constructor(@inject(ProfilesRepo) private profilesRepo: ProfilesRepo) {}

	@httpGet('/all')
	private async getAll(@request() req: Request, @response() res: Response) {
		try {
			const docs = await this.profilesRepo.getAll();
			res.send(docs);
		} catch (err) {
			res.status(500).send(err);
		}
	}
}
