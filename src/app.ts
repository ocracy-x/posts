import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

// load repos
import { FirebaseCommentsRepo } from './comments/comments_repo';
import {
	CommunitiesFirestore,
	CommunitiesRepo,
} from './communities/communities.repo';

// load services
import {
	CommentsService,
	RedisCommentsService,
} from './comments/comments_service';

// load controllers
import './comments/comments_controller';
import './communities/communities.controller';
import { FirestoreProfilesRepo, ProfilesRepo } from './profiles/profiles.repo';

// inject dependencies
const container = new Container();

// container.bind<FirebaseCommentsRepo>(FirebaseCommentsRepo).toSelf();
// container.bind<CommunitiesRepo>(CommunitiesRepo).to(CommunitiesFirestore);
// container.bind<CommentsService>(CommentsService).to(RedisCommentsService);

container.bind<ProfilesRepo>(ProfilesRepo).to(FirestoreProfilesRepo);

// build server
const server = new InversifyExpressServer(container, null, {
	rootPath: '/api',
});

// inject middleware
server.setConfig((app) => {
	app.use(cors());
	app.use(express.json());
	app.use(helmet());
	app.use(morgan('tiny'));
});

// export server
const app = server.build();
export default app;
