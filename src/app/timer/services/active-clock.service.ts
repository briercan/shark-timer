import { Injectable } from '@angular/core';
import { of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ClockType } from '../models/timer.models';
import { StopwatchService } from './stopwatch.service';
import { IClockService, TimerService, TimerState } from './timer.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveClockService {

  private services: Record<string, IClockService> = {};

  private activeService: IClockService;


  constructor(private timerService: TimerService, private stopwatchService: StopwatchService) {

    this.services[ClockType.Timer] = this.timerService;
    this.services[ClockType.Stopwatch] = this.stopwatchService;
  }

  public setActiveClock = (type: ClockType) => {
    this.activeService = this.services[type];
  }

  public start = () => {
    if(this.activeService){
      this.activeService.start();
    }
  }

  public stop = () => {
    if(this.activeService){
      this.activeService.stop();
    }
  }

  public reset = () => {
    if(this.activeService){
      this.activeService.reset();
    }
  }

  public toggle = () => {
    if(this.activeService){
      this.activeService.toggle();
    }
  }

  public end = (arg: boolean) => {
    if(this.activeService){
      this.activeService.end(arg);
    }
  }

  public getState = () => {
    return of(this.activeService)
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
