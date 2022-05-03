import { Firestore } from '@google-cloud/firestore';
import { Repo } from '../repo';

export class Community {
	constructor(readonly name: string) {}
}

export abstract class CommunitiesRepo extends Repo<Community> {
	constructor() {
		super('community');
	}
}

export class CommunitiesFirestore extends CommunitiesRepo {
	private store = new Firestore().collection(this.collection);

	getAll(): Promise<Community[]> {
		throw new Error('Method not implemented.');
	}
	create(item: Community): Promise<Community> {
		throw new Error('Method not implemented.');
	}

	update(item: Community): Promise<Community> {
		throw new Error('Method not implemented.');
	}
	delete(item: Community): Promise<Community> {
		throw new Error('Method not implemented.');
	}
}
