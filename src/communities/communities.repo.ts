import {
	DocumentData,
	DocumentSnapshot,
	Firestore,
} from '@google-cloud/firestore';
import { Repo } from '../util';

export class Community {
	constructor(readonly name: string, readonly createdAt: Date = new Date()) {}
	toJson(): Object {
		return {
			name: this.name,
			created_at: this.createdAt,
		};
	}

	static fromData(data: DocumentData): Community {
		return new Community(data.name, data.created_at);
	}
}

export abstract class CommunitiesRepo extends Repo<Community> {
	constructor() {
		super('community');
	}
}

export class CommunitiesFirestore extends CommunitiesRepo {
	private converter = {
		toFirestore(community: Community): DocumentData {
			return community.toJson();
		},
		fromFirestore(snapshot: DocumentSnapshot): Community {
			const data = snapshot.data();
			if (!data) throw Error('No data');
			return Community.fromData(data);
		},
	};

	private store = new Firestore()
		.collection(this.collection)
		.withConverter(this.converter);

	getAll(): Promise<Community[]> {
		throw new Error('Method not implemented.');
	}

	async create(item: Community): Promise<Community> {
		await this.store.doc(item.name).set(item, { merge: false });
		return item;
	}

	update(item: Community): Promise<Community> {
		throw new Error('Method not implemented.');
	}
	delete(item: Community): Promise<Community> {
		throw new Error('Method not implemented.');
	}
}
