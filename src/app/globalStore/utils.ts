import { MemoizedSelector, DefaultProjectorFn } from '@ngrx/store';

import { distinctUntilChanged, map} from 'rxjs/operators';
import { combineLatest, isObservable, Observable } from 'rxjs';
import { isEqual } from 'lodash';

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

        Observable<unknown> |
        MemoizedSelector<any, any, DefaultProjectorFn<any>> |
        Function
    )[],
    mapFn: (...args) => unknown) {
      console.log('creating selector LKE');
      return function memoizedLKE(store) {
        const cleanSelectors = selectors.map((selector) => {
          if (!isObservable(selector)) {
            console.log(selector.name);
            // In case it's a Memoized selector (from ngRx), we use the store to return an observable
            if (selector.name === 'memoized') {
              return store.pipe(
                map(selector as MemoizedSelector<any, any, DefaultProjectorFn<any>>),
                distinctUntilChanged((p, n) => isEqual(p, n))
              );
            }
            // If not it means
            return selector(store);
          }
          // Already an observable (from Ogma store)
          console.log('Already an observable (from Ogma store)');
          return selector;
        });
        console.log('finished mapping');
        return combineSelectors(cleanSelectors, mapFn);
      };
}
