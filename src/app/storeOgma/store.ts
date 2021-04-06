import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AppState } from '../store/counter.reducer';
import { isEqual } from 'lodash';


export class StoreOgma extends BehaviorSubject<AppState> {
    constructor(d: AppState) {
      super(d);
    }

    /**
     * Modify Ogma state based on a method
     */
    public dispatch(mapFn: (state: AppState) => AppState): void {
      this.next(mapFn(this.value));
    }

    /**
     * Return a piece of state
     */
    public selectStore<K>(mapFn: (state: AppState) => K): Observable<K> {
      return this.pipe(
        map(mapFn),
        distinctUntilChanged((p, n) => isEqual(p, n))
      );
    }

    /**
     * Clear the state of Ogma
     */
    public clear(): void {
      this.next({
        feature: {
            counter: 0
        }
    });
    }
}

export const storeOgma = new StoreOgma({
    feature: {
        counter: 0
    }
});
