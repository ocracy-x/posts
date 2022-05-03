import { injectable } from 'inversify/lib/annotation/injectable';
import { unmanaged } from 'inversify/lib/annotation/unmanaged';

@injectable()
export abstract class Repo<T> {
	constructor(@unmanaged() readonly collection: string) {}
	abstract getAll(): Promise<T[]>;
	abstract create(item: T): Promise<T>;
	abstract update(item: T): Promise<T>;
	abstract delete(item: T): Promise<T>;
}
