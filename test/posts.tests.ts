import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
should();

describe('Posts', () => {
	describe('GET /api/posts/:post_id', () => {});
	describe('POST /api/posts/:post_id', () => {});
	describe('PUT /api/posts/:post_id', () => {});
	describe('DELETE /api/posts/:post_id', () => {});
});
