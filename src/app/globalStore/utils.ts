import { MemoizedSelector, DefaultProjectorFn } from '@ngrx/store';

import { distinctUntilChanged, map} from 'rxjs/operators';
import { combineLatest, isObservable, Observable } from 'rxjs';
import { isEqual } from 'lodash';
import { StoreOgma } from '../storeOgma/store';
import { AppState } from '../store/counter.reducer';

/**
 * Combine multiple selectors together and create new one using a mapping function
 */
function combineSelectors<T>(selectors: Observable<unknown>[], mapFn: (...args) => T): Observable<T> {
    return combineLatest(selectors).pipe(map((args) => mapFn(...args)));
}

/**
 * Return a function that provided the ngRx store instance will create an observable, mapping the 2 states together
 */
export function createSelectorLKE(
    selectors:
    (
        MemoizedSelector<any, any, DefaultProjectorFn<any>> |
        Function
    )[],
    mapFn: (...args) => unknown) {
      console.log('creating selector LKE');
      // memoizedLKE has now a dependency to the 2 stores (note: storeOgma could be optinnal to avoid an unnecessary dependency in the component)
      return function memoizedLKE(store, storeOgma) {
        const cleanSelectors = selectors.map((selector) => {
            console.log(selector.name);
            // In case it's a Memoized selector (from ngRx), we use the store to return an observable
            if (selector.name === 'memoizedLKE') {
              // TODO: type correctly the memoizedOgma function)
              return (selector as Function)(store, storeOgma);
            } else if(selector.name === 'memoizedOgma') {
              return selector(storeOgma);
            } else {
              return store.pipe(
                map(selector as MemoizedSelector<any, any, DefaultProjectorFn<any>>),
                distinctUntilChanged((p, n) => isEqual(p, n))
              );
            }
        });
        console.log('finished mapping');
        return combineSelectors(cleanSelectors, mapFn);
      };
}

/**
 * Create a simple selector for Ogma that can be reused in createSelectorLKE
 * Note: to create complex selectors, we could use createSelectorLKE with multiple Ogma selectors and a mapping function
 */
export function createSelectorOgma<T>(selector: (state: AppState) => unknown) {
  return function memoizedOgma(storeOgma: StoreOgma): Observable<T>  {
    return storeOgma.pipe(
      map(selector),
      distinctUntilChanged((p, n) => isEqual(p, n))
    ) as Observable<T>
  }
}
