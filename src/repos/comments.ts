import { injectable, inject } from 'inversify';

abstract class CommentsRepo {
	readonly name: string = 'comments';
}

@injectable()
class FirebaseCommentsRepo extends CommentsRepo {}
