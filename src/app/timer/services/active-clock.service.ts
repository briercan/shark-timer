import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ClockType } from '../models/timer.models';
import { StopwatchService } from './stopwatch.service';
import { IClockService, TimerService, TimerState } from './timer.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveClockService {

  private services: Record<string, IClockService> = {};

  private activeService$ = new BehaviorSubject<IClockService>(null);


  constructor(private timerService: TimerService, private stopwatchService: StopwatchService) {

    this.services[ClockType.Timer] = this.timerService;
    this.services[ClockType.Stopwatch] = this.stopwatchService;
  }

  public setActiveClock = (type: ClockType) => {
    this.activeService$.next(this.services[type]);
  }

  public start = () => {
    const activeService = this.activeService$.getValue();
    if(activeService){
      activeService.start();
    }
  }

  public stop = () => {
    const activeService = this.activeService$.getValue();
    if(activeService){
      activeService.stop();
    }
  }

  public reset = () => {
    const activeService = this.activeService$.getValue();
    if(activeService){
      activeService.reset();
    }
  }

  public toggle = () => {
    const activeService = this.activeService$.getValue();
    if(activeService){
      activeService.toggle();
    }
  }

  public end = (arg: boolean) => {
    const activeService = this.activeService$.getValue();
    if(activeService){
      activeService.end(arg);
    }
  }

  public getState = () => {
    return this.activeService$
    .pipe(
      switchMap(activeService => {
        if(!activeService){
          return of(TimerState.Stopped);
        } else {
          return activeService.getState();
        }
      })
    );

  }

}
