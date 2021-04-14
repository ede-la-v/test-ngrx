import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { increment, decrement, reset } from '../store/counter.actions';
import { selectCount} from '../store/counter.selector';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { AppState } from '../store/counter.reducer';
import { storeOgma } from '../storeOgma/store';
import { getCount } from '../storeOgma/selector';
import { additionSelector, additionSelector2 } from '../globalStore/selectors';

@Component({
  selector: 'app-my-counter',
  templateUrl: './my-counter.component.html',
  styleUrls: ['./my-counter.component.css'],
})
export class MyCounterComponent implements OnInit {
  count$: Observable<number>;
  countOgma$: Observable<number>;
  addition$: Observable<unknown>;
  addition2$: Observable<unknown>;

  constructor(private store: Store<AppState>) {

  }

  ngOnInit() {
    console.log('begin ngOnInit => will create Observables');
    this.count$ = this.store.pipe(
        map(selectCount),
        distinctUntilChanged((p, n) => isEqual(p, n))
      );
    this.countOgma$ = getCount(storeOgma);

    console.log('######creating first');
    this.addition$ = additionSelector(this.store, storeOgma);
    console.log('######creating second');
    this.addition2$ = additionSelector2(this.store, storeOgma);
    console.log('finish all');
  }

  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement());
  }

  reset() {
    this.store.dispatch(reset());
  }

  incrementOgma() {
    storeOgma.dispatch((state) => {
        return {
          ...state,
          feature: {
              counter: state.feature.counter + 1
          }
        };

    });
  }

  decrementOgma() {
    storeOgma.dispatch((state) => {
        return {
          ...state,
          feature: {
              counter: state.feature.counter - 1
          }
        };

    });
  }

  resetOgma() {
    storeOgma.dispatch(() => {
        return {
          feature: {
              counter: 0
          }
        };
    });
  }
}
