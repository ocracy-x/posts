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
			created_at: this.createdAt.toUTCString(),
		};
	}

	static fromData(data: DocumentData): Community {
		return new Community(data.name, new Date(data.created_at));
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

	async getAll(): Promise<Community[]> {
		const snapshot = await this.store.get();
		const docs = snapshot.docs.map((doc) => doc.data());
		return docs;
	}

	async create(item: Community): Promise<Community> {
		await this.store.doc(item.name).set(item, { merge: false });
		return item;
	}

	async read(id: string): Promise<Community | undefined> {
		const snapshot = await this.store.doc(id).get();
		const doc = snapshot.data();
		return doc;
	}

	update(item: Community): Promise<Community> {
		throw new Error('Method not implemented.');
	}

	async delete(id: string): Promise<null> {
		await this.store.doc(id).delete();
		return null;
	}
}
