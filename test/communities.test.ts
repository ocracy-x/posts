import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
should();

describe('Comments', () => {
	describe('POST /api/communities/:communty_id', () => {});
	describe('GET /api/communities/:communty_id', () => {});
	describe('PUT /api/communities/:communty_id', () => {});
	describe('PATCH /api/communities/:communty_id', () => {});
	describe('DELETE /api/communities/:communty_id', () => {});
});
