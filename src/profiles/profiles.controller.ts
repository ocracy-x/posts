import 'reflect-metadata';
import { Response } from 'express';
import { inject } from 'inversify';
import {
	controller,
	httpGet,
	httpPost,
	interfaces,
	queryParam,
	requestParam,
	response,
	httpDelete,
	httpPatch,
} from 'inversify-express-utils';
import { Profile, ProfileFields, ProfilesRepo } from './profiles.repo';

@controller('/v1/profiles')
export class ProfilesController implements interfaces.Controller {
	constructor(@inject(ProfilesRepo) private profilesRepo: ProfilesRepo) {}

	/// TODO: needs to be paginated
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
			res.status(500).send();
		}
	}

	@httpGet('/:username')
	private async read(
		@requestParam('username') username: string,
		@response() res: Response,
	) {
		try {
			const profile = await this.profilesRepo.read(username);
			if (!profile) {
				res.sendStatus(404);
			} else {
				res.send(profile);
			}
		} catch (err: any) {
			res.status(500).send();
		}
	}

	@httpPatch('/:prevUsername')
	private async patch(
		@requestParam('prevUsername') prevUsername: string,
		@queryParam('username') username: string,
		@response() res: Response,
	) {
		const fields: ProfileFields = { username };
		const doc = await this.profilesRepo.patch(prevUsername, fields);
		if (!doc) {
			res.status(404).send();
		} else {
			res.status(201).send(doc);
		}
	}

	@httpDelete('/:username')
	private async delete(
		@requestParam('username') username: string,
		@response() res: Response,
	) {
		try {
			const deleted = await this.profilesRepo.delete(username);
			if (deleted) {
				res.send(204);
			} else {
				res.send(404);
			}
		} catch (err) {
			res.status(500).send();
		}
	}
}
