import { selectCount, selectFeature } from "../store/counter.selector";
import { getCount } from "../storeOgma/selector";
import { createSelectorLKE } from "./utils";

export let additionSelector = createSelectorLKE([getCount, selectCount], (state1, state2) => state1 + state2);

export let additionSelector2 = createSelectorLKE(
    [getCount, additionSelector, selectFeature],
    (state1, state2, state3) => state1 + state2 + state3.counter
);
