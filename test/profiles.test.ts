import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { Profile } from '../src/profiles/profiles.repo';

chai.use(chaiHttp);
should();

describe('Profiles', () => {
	const test = 'test';
	const other = 'other';
	const invalid = 'aawef.__l-.fa///';

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
						profile.should.haveOwnProperty('id');
						profile.should.haveOwnProperty('username');
						profile.should.haveOwnProperty('joined');
					});
					done();
				});
		});
	});

	describe('POST /profile', () => {
		it('should create a profile with username "test"', (done) => {
			chai
				.request(app)
				.post('/api/v1/profiles')
				.send({ username: test })
				.end((_, res) => {
					res.status.should.be.oneOf([201, 400]);
					done();
				});
		});

		it('should fail to create duplicate profile', (done) => {
			chai
				.request(app)
				.post('/api/v1/profiles')
				.send({ username: test })
				.end((_, res) => {
					res.status.should.equal(400);
					done();
				});
		});

		it('should validate usernames', (done) => {
			chai
				.request(app)
				.post('/api/v1/profiles')
				.send({ username: invalid })
				.end((_, res) => {
					res.status.should.equal(422);
					done();
				});
		});
	});

	describe('GET /profile/:username', () => {
		it('should have a profile with username test', (done) => {
			chai
				.request(app)
				.get(`/api/v1/profiles/${test}`)
				.end((_, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});

	describe('PATCH /profile/:prevUsername', () => {
		it('should validate timestamp', (done) => {
			chai
				.request(app)
				.patch('/api/v1/profiles/test')
				.send({ joined: 'not a timestamp' })
				.end((_, res) => {
					res.should.have.status(422);
					done();
				});
		});

		it('should change timestamp', (done) => {
			const time = 1;
			chai
				.request(app)
				.patch('/api/v1/profiles/test')
				.send({ joined: time })
				.end((_, res) => {
					res.should.have.status(200);
					const doc = Profile.fromJson(res.body);
					const target = new Date(time).toUTCString();
					const actual = doc.joined.toUTCString();
					expect(actual).to.equal(target);
					done();
				});
		});

		it('should change username', (done) => {
			chai
				.request(app)
				.patch('/api/v1/profiles/test')
				.send({ username: other })
				.end((_, res) => {
					res.should.have.status(200);
					const doc = Profile.fromJson(res.body);
					expect(doc.username).to.equal(other);
					done();
				});
		});

		it('should not have a profile with username test', (done) => {
			chai
				.request(app)
				.get(`/api/v1/profiles/${test}`)
				.end((_, res) => {
					res.should.have.status(404);
					done();
				});
		});

		describe('DELETE /profile/:username', () => {
			it('should delete profile with username "other"', (done) => {
				chai
					.request(app)
					.delete(`/api/v1/profiles/${other}`)
					.end((_, res) => {
						res.status.should.equal(204);
						done();
					});
			});
		});
	});
});
