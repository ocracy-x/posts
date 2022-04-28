import 'reflect-metadata';
import { injectable } from 'inversify';
import { faker } from '@faker-js/faker';

export class Comment {
	children = Array<Comment>();
	constructor(public readonly username: string, public readonly body: string) {}
}

@injectable()
export class FirebaseCommentsRepo {
	readonly repo: string = 'comments';
	getById(id: string | null): Comment {
		const username: string = faker.internet.userName();
		const body: string = faker.lorem.sentence(1);
		const comment = new Comment(username, body);
		return comment;
	}
}
