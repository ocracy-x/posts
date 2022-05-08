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
		it('should not throw an interal error', (done) => {
			chai
				.request(app)
				.get('/api/v1/profiles/test')
				.end((_, res) => {
					res.should.not.have.status(500);
					done();
				});
		});
	});
});
