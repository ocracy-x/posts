import { Container } from 'inversify';
import { FirebaseCommentsRepo } from './comments/comments_repo';
import {
	CommentsService,
	RedisCommentsService,
} from './comments/comments_service';

const container = new Container();

container.bind<FirebaseCommentsRepo>(FirebaseCommentsRepo).toSelf();
container.bind<CommentsService>(CommentsService).to(RedisCommentsService);

export default container;
