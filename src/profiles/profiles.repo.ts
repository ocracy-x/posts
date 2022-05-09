import {
	DocumentData,
	DocumentSnapshot,
	Firestore,
} from '@google-cloud/firestore';
import { CRUD } from '../util';

export class Profile {
	constructor(
		public readonly username: string,
		public readonly joined: Date = new Date(),
	) {}

	toJson(): Object {
		return {
			username: this.username,
			joined: this.joined.toUTCString(),
		};
	}

	static fromJson(json: any): Profile {
		const username: string = json.username;
		const joined = json.joined ? new Date(json.joined) : undefined;
		return new Profile(username, joined);
	}
}

export abstract class ProfilesRepo extends CRUD<Profile> {
	constructor() {
		super('profiles');
	}

	abstract getAll(): Promise<Profile[]>;
}

export class FirestoreProfilesRepo extends ProfilesRepo {
	// converter documentation:
	// https://firebase.google.com/docs/reference/node/firebase.firestore.FirestoreDataConverter
	private converter = {
		toFirestore(profile: Profile): DocumentData {
			return profile.toJson();
		},
		fromFirestore(snapshot: DocumentSnapshot): Profile {
			const data = snapshot.data();
			if (!data) {
				throw Error('Firestore snapshot has no data for Profile: ' + data);
			}
			return Profile.fromJson(data);
		},
	};

	private store = new Firestore();

	private communities = this.store
		.collection(this.key)
		.withConverter(this.converter);

	async getAll(): Promise<Profile[]> {
		const snapshot = await this.communities.get();
		const profiles = snapshot.docs.map((doc) => Profile.fromJson(doc.data()));
		return profiles;
	}

	// no overwrites allowed
	async create(item: Profile): Promise<Profile | void> {
		const doc = await this.read(item.username);
		if (doc) return;
		return await this.update(item);
	}
	async read(username: string): Promise<Profile | void> {
		const snapshot = await this.communities
			.where('username', '==', username)
			.limit(1)
			.get();
		const list = snapshot.docs.map((doc) => doc.data());
		if (!list.length) return;
		return list[0];
	}
	async update(item: Profile): Promise<Profile> {
		await this.communities.doc(item.username).set(item, { merge: false });
		return item;
	}

	async delete(id: string): Promise<void> {
		await this.communities.doc(id).delete();
	}
}
