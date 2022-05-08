import { injectable } from 'inversify/lib/annotation/injectable';
import { unmanaged } from 'inversify/lib/annotation/unmanaged';

@injectable()
export abstract class CRUD<T> {
	constructor(@unmanaged() readonly key: string) {}
	abstract create(item: T): Promise<T | void>;
	abstract read(id: string): Promise<T | void>;
	abstract update(item: T, patch: boolean): Promise<T>;
	abstract delete(id: string): Promise<void>;
}
