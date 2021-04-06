import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset } from './counter.actions';

export interface FeatureState {
    counter: number;
  }

export interface AppState {
    feature: FeatureState;
  }

export const initialState: AppState = {
    feature: {
        counter: 0
    }
};

const _counterReducer = createReducer(
  initialState,
  on(increment, (state) => {
      console.log(state)
      return {
        ...state,
        feature: {
            counter: state.feature.counter + 1
        }
      }
  }),
  on(decrement, (state) => {
    return {
      ...state,
      feature: {
          counter: state.feature.counter -1
      }
    }
    
}),
  on(reset, (state) => initialState)
);

export function counterReducer(state, action) {
  return _counterReducer(state, action);
}
