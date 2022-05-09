import {
	DocumentData,
	DocumentReference,
	DocumentSnapshot,
	Firestore,
} from '@google-cloud/firestore';
import { CRUD } from '../util';

export interface ProfileFields {
	readonly id?: string;
	readonly username?: string;
	readonly joined?: Date;
}

export interface ProfileConfig extends ProfileFields {
	readonly username: string;
}

export class Profile {
	public readonly id?: string;

	public get hasId(): boolean {
		return !!this.id;
	}

	public readonly username: string;
	public readonly joined: Date;
	constructor(config: ProfileConfig) {
		this.id = config.id;
		this.username = config.username;
		this.joined = config.joined ? config.joined : new Date();
	}

	toJson(): Object {
		return {
			username: this.username,
			joined: this.joined.toUTCString(),
		};
	}

	static fromJson(json: any): Profile {
		const username: string = json.username;
		const id = json.id;
		const joined = json.joined ? new Date(json.joined) : undefined;
		return new Profile({ id, username, joined });
	}
}

export abstract class ProfilesRepo extends CRUD<Profile, ProfileFields> {
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
			const id = snapshot.id;
			const json = { id, ...data };
			if (!data) {
				throw Error('Firestore snapshot has no data for Profile: ' + data);
			}
			return Profile.fromJson(json);
		},
	};

	private store = new Firestore();
	private profiles = this.store
		.collection(this.key)
		.withConverter(this.converter);

	async getAll(): Promise<Profile[]> {
		const snapshot = await this.profiles.get();
		const profiles = snapshot.docs.map((doc) => Profile.fromJson(doc.data()));
		return profiles;
	}

	private async getRef(
		username: string,
	): Promise<DocumentReference<Profile> | void> {
		const ref = await this.profiles
			.where('username', '==', username)
			.limit(1)
			.get();
		const docs = ref.docs;
		if (!docs.length) return;
		return docs[0].ref;
	}

	async create(profile: Profile): Promise<Profile | void> {
		const prevDoc = await this.read(profile.username);
		if (prevDoc) return;
		const ref = await this.profiles.add(profile);
		const doc = await ref.get();
		const data = doc.data();
		return data;
	}

	async read(username: string): Promise<Profile | void> {
		const ref = await this.getRef(username);
		if (!ref) return;
		const doc = await ref.get();
		return doc.data();
	}

	async patch(
		prevUsername: string,
		config: ProfileFields,
	): Promise<Profile | void> {
		const ref = await this.getRef(prevUsername);
		if (!ref) return;
		await ref.update(config);
		const doc = await ref.get();
		return doc.data();
	}

	async delete(username: string): Promise<boolean> {
		const ref = await this.getRef(username);
		if (!ref) return false;
		await ref.delete();
		return true;
	}
}
