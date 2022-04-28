import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { FirebaseCommentsRepo, Comment } from './comments_repo';

@injectable()
export abstract class CommentsService {
	protected _repo: FirebaseCommentsRepo;
	constructor(@inject(FirebaseCommentsRepo) repo: FirebaseCommentsRepo) {
		this._repo = repo;
	}
	abstract buildTree(postId: string): Comment[];
}
@injectable()
export class RedisCommentsService extends CommentsService {
	buildTree(postId: string): Comment[] {
		return [this._repo.getById('')];
	}
}
