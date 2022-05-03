import {
	DocumentData,
	DocumentSnapshot,
	Firestore,
} from '@google-cloud/firestore';
import { rejects } from 'assert';
import { Repo } from '../util';

export class Community {
	constructor(readonly name: string) {}
	toJson(): Object {
		return {
			name: this.name,
		};
	}

	static fromJson(json: Map<string, string>): Community {
		const name = json.get('name');
		if (name == null) throw Error('Community requires name');
		return new Community(name);
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
			if (!data) throw Error();
			return new Community(data.name);
		},
	};
	private store = new Firestore().collection(this.collection);

	getAll(): Promise<Community[]> {
		throw new Error('Method not implemented.');
	}
	async create(item: Community): Promise<Community> {
		await this.store.add(item);
		return item;
	}

	update(item: Community): Promise<Community> {
		throw new Error('Method not implemented.');
	}
	delete(item: Community): Promise<Community> {
		throw new Error('Method not implemented.');
	}
}
