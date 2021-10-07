import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, timer } from 'rxjs';
import { map, mapTo, scan, switchMap, takeUntil, tap } from 'rxjs/operators';
import { IClockService, TimerState } from './timer.service';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService implements IClockService {
  private isOn: boolean;

  isRunning$ = new BehaviorSubject<boolean>(false);
  stopwatchReset$ = new Subject<void>();
  resetClicked$ = new Subject<void>();

  time$: Observable<number>;
  interval$: Observable<number>;

  constructor() {
    this.interval$ = timer(0, 10);

  }
  getState(): Observable<TimerState> {
    return this.isRunning$
    .pipe(
      map(x => {
        return x ? TimerState.Running : TimerState.Stopped;
      })
    );
  }
  end(arg: boolean) {
    //noop
  }
  toggle() {
    if(this.isOn){
      this.stop();
    } else {
      this.start();
    }
  }
  reset() {
    this.isOn = false;
    this.stopwatchReset$.next()
  }

  start() {
    this.isOn = true;
    this.isRunning$.next(true);
  }
  stop() {
    this.isOn = false;
    this.isRunning$.next(false);
  }

  onReset = () => {
    return this.stopwatchReset$;
  }

  buildTime = (reset: Observable<void>) => {
    return this.isRunning$.pipe(
      switchMap(start => (start ? this.interval$.pipe(mapTo(10)) : EMPTY)),
      scan((acc, val) => acc + val, 0),
      takeUntil(reset)
    );
  }
}
