import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService implements IClockService {

  isOn: boolean;

  isRunning$ = new BehaviorSubject<boolean>(false);
  timerEnd$ = new BehaviorSubject<boolean>(false);
  timerReset$ = new BehaviorSubject<number>(0);

  constructor() { }

  time$: Observable<number>;

  getState(): Observable<TimerState> {
    return combineLatest([this.isRunning$, this.timerEnd$])
    .pipe(
      map(([isRunning, timerEnded]) => {
        if(timerEnded){
          return TimerState.Complete;
        }
        if(isRunning){
          return TimerState.Running;
        } else {
          return TimerState.Stopped;
        }
      })
    )

  }

  toggle() {
    if(this.isOn){
      this.stop();
    } else {
      this.start();
    }
  }

  end(timerComplete: boolean) {
    this.timerEnd$.next(timerComplete);
    if (timerComplete) {
      //this.startAlarm();
      //TODO: this
    }
  }
  reset() {
    this.timerReset$.next(0);
  }

  public start = () => {
    this.isOn = true;
    this.isRunning$.next(true);
  }

  public stop = () => {
    this.isOn = false;
    this.isRunning$.next(false);
  }

}

export interface IClockService{
  start();
  stop();
  reset();
  toggle();
  end(arg: boolean);
  getState(): Observable<TimerState>;
  isRunning$: Observable<boolean>;

  time$: Observable<number>;
}

export enum TimerState{
  Stopped,
  Running,
  Complete
}
