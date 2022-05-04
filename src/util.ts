import { injectable } from 'inversify/lib/annotation/injectable';
import { unmanaged } from 'inversify/lib/annotation/unmanaged';

@injectable()
export abstract class Repo<T> {
	constructor(@unmanaged() readonly collection: string) {}
	abstract create(item: T): Promise<T>;
	abstract read(id: string): Promise<T | undefined>;
	abstract update(item: T): Promise<T>;
	abstract delete(id: string): Promise<undefined>;
	abstract getAll(): Promise<T[]>;
}

export interface Serializable<T> {
	deserialize(input: Object): T;
}
