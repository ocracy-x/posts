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
						profile.should.haveOwnProperty('id');
						profile.should.haveOwnProperty('username');
						profile.should.haveOwnProperty('joined');
					});
					done();
				});
		});
	});

	describe('DELETE /profile/:id', () => {
		it('should delete profile with username "test"', (done) => {
			chai
				.request(app)
				.delete('/api/v1/profiles/test')
				.end((_, res) => {
					res.status.should.be.oneOf([204, 400]);
					done();
				});
		});
	});

	describe('POST /profile', () => {
		let status: number;
		let testProfile: Profile;
		before((done) => {
			chai
				.request(app)
				.post('/api/v1/profiles')
				.query({
					username: 'test',
				})
				.end((_, res) => {
					status = res.status;
					testProfile = Profile.fromJson(res.body);
					done();
				});
		});

		it('should create a profile with username "test"', (done) => {
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

		it('should fail to create duplicate profile', (done) => {
			chai
				.request(app)
				.post('/api/v1/profiles')
				.query({
					username: 'test',
				})
				.end((_, res) => {
					res.status.should.equal(400);
					done();
				});
		});
	});

	describe('GET /profile/:id', () => {
		let status: number;
		let testProfile: Profile;

		before((done) => {
			chai
				.request(app)
				.get('/api/v1/profiles/test')
				.end((_, res) => {
					status = res.status;
					testProfile = Profile.fromJson(res.body);
					done();
				});
		});

		it('should have a profile with username test', (done) => {
			status.should.equal(200);
			done();
		});
	});
});
