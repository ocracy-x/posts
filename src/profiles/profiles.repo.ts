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

	private store = new Firestore()
		.collection(this.key)
		.withConverter(this.converter);

	async getAll(): Promise<Profile[]> {
		const snapshot = await this.store.get();
		const profiles = snapshot.docs.map((doc) => Profile.fromJson(doc.data()));
		return profiles;
	}

	create(item: Profile): Promise<Profile> {
		throw new Error('Method not implemented.');
	}
	read(id: string): Promise<Profile | undefined> {
		throw new Error('Method not implemented.');
	}
	update(item: Profile, patch: boolean): Promise<Profile> {
		throw new Error('Method not implemented.');
	}
	delete(id: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
}
