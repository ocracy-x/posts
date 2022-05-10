import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import {
	controller,
	httpGet,
	httpPost,
	interfaces,
	requestParam,
	response,
	httpDelete,
	httpPatch,
	request,
	requestBody,
	Middleware,
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
			in: 'body',
			errorMessage: 'Username is invalid',
			custom: {
				options: (username) => usernameRegex.test(username),
			},
		},
		joined: {
			optional: true,
			in: 'body',
			errorMessage: 'Joined should be a timestamp since epoch in ms',
			isNumeric: true,
		},
	});
}

function handleValidationMiddleware(optional: boolean): Middleware {
	return (req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).json({ errors: errors.array() });
		} else {
			next();
		}
	};
}

@controller('/profiles')
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
		/// TODO: move validation error handling to middleware
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

	@httpPatch('/:prevUsername', ...ProfileValidator(true))
	private async patch(
		@requestParam('prevUsername') prevUsername: string,
		@request() req: Request,
		@requestBody() fields: ProfileFields,
		@response() res: Response,
	) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).send({ errors: errors.array() });
		} else {
			try {
				const doc = await this.profilesRepo.patch(prevUsername, fields);
				res.status(200).send(doc);
			} catch (err) {
				if (err == 400) {
					res.status(400).send('Username already taken');
				} else if (err == 404) {
					res.status(404).send('No profile found with that username');
				} else {
					res.status(500).send();
				}
			}
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
