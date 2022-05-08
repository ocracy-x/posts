import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { Profile } from '../src/profiles/profiles.repo';

chai.use(chaiHttp);
should();

describe('Profiles', () => {
	describe('GET /profiles/all', () => {
		it('should get an array of profiles', (done) => {
			chai
				.request(app)
				.get('/api/v1/profiles/all')
				.end((_, res) => {
					res.should.have.status(200);
					const body = res.body;
					body.should.be.a('array');
					body.forEach((profile: Profile) => {
						profile.should.haveOwnProperty('username');
						profile.should.haveOwnProperty('joined');
					});
					done();
				});
		});
	});

	describe('GET /profile/:id', () => {
		it('should only have status 200 or 404', (done) => {
			chai
				.request(app)
				.get('/api/v1/profiles/test')
				.end((_, res) => {
					res.status.should.be.oneOf([200, 404]);
					done();
				});
		});
	});

	describe('POST /profile', () => {
		it('should only have status 201 or 400', (done) => {
			chai
				.request(app)
				.post('/api/v1/profiles')
				.query({
					username: 'test',
				})
				.end((_, res) => {
					res.status.should.be.oneOf([201, 400]);
					done();
				});
		});

		it('should fail to write duplicate usernames', (done) => {
			chai
				.request(app)
				.post('/api/v1/profiles')
				.query({
					username: 'test',
				})
				.end((_, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});

	describe('DELETE /profile/:id', () => {
		it('should only have status 200', (done) => {
			chai
				.request(app)
				.delete('/api/v1/profiles/test')
				.end((_, res) => {
					res.should.have.status(200);
					done();
				});
		});

		it('should not have a profile with username test', (done) => {
			chai
				.request(app)
				.get('/api/v1/profiles/test')
				.end((_, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
});
