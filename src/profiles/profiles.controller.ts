import 'reflect-metadata';
import { Request, Response } from 'express';
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
	request,
	requestBody,
} from 'inversify-express-utils';
import {
	Profile,
	ProfileConfig,
	ProfileFields,
	ProfilesRepo,
} from './profiles.repo';
import { checkSchema, validationResult } from 'express-validator';

// regex to check username: https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
const usernameRegex = new RegExp(
	'^(?=.{1,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$',
);

function ProfileValidator(usernameOptional: boolean = false) {
	return checkSchema({
		username: {
			optional: usernameOptional ? true : undefined,
			in: ['body'],
			errorMessage: 'Username is invalid',
			custom: {
				options: (username) => usernameRegex.test(username),
			},
		},
	});
}

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

	@httpPost('/', ...ProfileValidator())
	private async create(
		@request() req: Request,
		@response() res: Response,
		@requestBody() config: ProfileConfig,
	) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).json({ errors: errors.array() });
		} else {
			try {
				const profile = Profile.fromJson(config);
				const doc = await this.profilesRepo.create(profile);
				if (doc) {
					res.status(201).send(doc);
				} else {
					res.status(400).send('Username already exists');
				}
			} catch (err) {
				res.status(500).send(JSON.stringify(err));
			}
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
				res.status(204).send();
			} else {
				res.status(404).send();
			}
		} catch (err) {
			res.status(500).send();
		}
	}
}
