import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
should();

describe('Comments', () => {
	describe('GET /api/comment/:comment_id', () => {});
	describe('POST /api/comment/:comment_id', () => {});
	describe('PUT /api/comment/:comment_id', () => {});
	describe('DELETE /api/comment/:comment_id', () => {});
});
