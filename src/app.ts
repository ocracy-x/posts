import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

// load repos
import { FirestoreProfilesRepo, ProfilesRepo } from './profiles/profiles.repo';

// inject dependencies
const container = new Container();
container.bind<ProfilesRepo>(ProfilesRepo).to(FirestoreProfilesRepo);

// load controllers
import './profiles/profiles.controller';

// build server
const server = new InversifyExpressServer(container, null, {
	rootPath: '/api/v1',
});

// inject middleware
server.setConfig((app) => {
	app.use(cors());
	app.use(express.json());
	app.use(helmet());
	app.use(morgan('tiny'));
});

// build server
const app = server.build();
export default app;
