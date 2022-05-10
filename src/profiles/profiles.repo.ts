import {
	DocumentData,
	DocumentReference,
	DocumentSnapshot,
	Firestore,
	Transaction,
} from '@google-cloud/firestore';
import { CRUD } from '../util';

export interface ProfileFields {
	readonly id?: string;
	readonly username?: string;
	readonly joined?: number;
}

export interface ProfileConfig extends ProfileFields {
	readonly username: string;
}

export class Profile implements Omit<ProfileConfig, 'joined'> {
	public readonly id?: string;
	public readonly username: string;
	public readonly joined: Date;
	public get hasId(): boolean {
		return !!this.id;
	}

	constructor(config: ProfileConfig) {
		this.id = config.id;
		this.username = config.username;
		this.joined = config.joined ? new Date(config.joined) : new Date();
	}

	toJson(): Object {
		return {
			username: this.username,
			joined: this.joined.getTime(),
		};
	}

	static fromJson(json: any): Profile {
		const username: string = json.username;
		const id = json.id;
		const joined = json.joined;
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

	async getRefInTransaction(
		username: string,
		t: Transaction,
	): Promise<DocumentReference<Profile> | void> {
		const snapshots = await t.get(
			this.profiles.where('username', '==', username).limit(1),
		);
		const docs = snapshots.docs;
		if (docs.length) {
			return docs[0].ref;
		}
	}

	async create(profile: Profile): Promise<Profile | void> {
		const createdRef = await this.store.runTransaction(async (t) => {
			const duplicate = await this.getRefInTransaction(profile.username, t);
			if (duplicate) return;
			const ref = this.profiles.doc();
			await t.create(ref, profile);
			return ref;
		});
		const createdDoc = await createdRef?.get();
		return createdDoc?.data();
	}

	async read(username: string): Promise<Profile | void> {
		const ref = await this.getRef(username);
		if (!ref) return;
		const doc = await ref.get();
		return doc.data();
	}

	async patch(
		prevUsername: string,
		fields: ProfileFields,
	): Promise<Profile | void> {
		const patchedRef = await this.store.runTransaction(async (t) => {
			// reads:
			// verify user with prevUsername exists
			const ref = await this.getRefInTransaction(prevUsername, t);
			if (!ref) throw 404;

			// verify that the proposed alternate username is available
			if (fields.username) {
				const duplicate = await this.getRefInTransaction(fields.username, t);
				if (duplicate) throw 400;
			}

			// writes:
			// update document with new fields
			await t.update(ref, fields);
			return ref;
		});
		const patchedDoc = await patchedRef.get();
		return patchedDoc.data();
	}

	async delete(username: string): Promise<boolean> {
		const ref = await this.getRef(username);
		if (!ref) return false;
		await ref.delete();
		return true;
	}
}
