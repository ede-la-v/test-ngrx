import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState, FeatureState } from "./counter.reducer";

export const selectApp = createFeatureSelector<any, AppState>('test');
 
export const selectFeature = createSelector(
  selectApp,
  (state: AppState) => state.feature
);

export const selectCount = createSelector(
    selectFeature,
    (state: FeatureState) => state.counter
  );