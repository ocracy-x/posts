import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';
chai.use(chaiHttp);

describe('CommentsController', () => {
	describe('Sample', () => {
		it('should pass a sample test', () => {
			expect(true).to.equal(true);
		});

		it('should fetch comment tree', (done) => {
			chai
				.request(app)
				.get('/api/comments')
				.end((_, res) => {
					expect(res.status).to.equal(200);
					expect(res.body).to.be.a('array');
					done();
				});
		});
	});
});
