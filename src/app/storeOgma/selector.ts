import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FeatureState } from '../store/counter.reducer';
import { storeOgma } from './store';

function createFeatureSelectorOgma<T>(feature: string): Observable<T> {
    return storeOgma.pipe(map(state => state[feature]));
}

function createSelectorOgma<T>(selectors: Observable<unknown>[], mapFn: (...args) => T): Observable<T> {
    return combineLatest(selectors).pipe(map((args) => mapFn(...args)));
}
const stateFeature = createFeatureSelectorOgma<FeatureState>('feature');
export const getCount = createSelectorOgma([stateFeature], (state: FeatureState) => state.counter);

