import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { Community } from '../src/communities/communities.repo';

chai.use(chaiHttp);
should();

describe('Comments', () => {
	const id = 'test';
	describe('POST /v1/api/communities/', () => {
		it('should post a unique community', (done) => {
			const doc = new Community(id);
			chai
				.request(app)
				.post('/api/v1/communities')
				.send(doc)
				.end((err, res) => {
					if (err) {
						res.should.have.status(400);
					} else {
						res.should.have.status(201);
					}
					done();
				});
		});
	});

	describe('GET /v1/api/communities/:id', () => {
		chai.request(app).post('/api/v1/communities/test').end((err, res) => {

		});
	});
	describe('PUT /v1/api/communities/', () => {});
	describe('DELETE /v1/api/communities/:id', () => {});
});
