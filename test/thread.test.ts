import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
should();

describe('Thread', () => {
	describe('GET /api/thread/:post_id', () => {
		it('should get an array of comments', () => {});
		it('should be ranked by hotness score', () => {});
		it('should paginate', () => {});
	});
});
