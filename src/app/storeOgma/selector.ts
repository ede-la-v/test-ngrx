import { createSelectorOgma } from '../globalStore/utils';
import { AppState } from '../store/counter.reducer';


// Here we only create a simple mapping of the globa ogma state to get the counter
export const getCount = createSelectorOgma<number>((state: AppState) => state.feature.counter);

