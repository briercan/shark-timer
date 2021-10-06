import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, Subject, timer } from 'rxjs';
import { filter, map, mapTo, scan, startWith, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { TimerService } from '../../services/timer.service';

import { TimeDisplayComponent } from '../time-display/time-display.component';
import { TimerControlsComponent } from '../timer-controls/timer-controls.component';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit, OnDestroy {
  @ViewChild('timeDisplay') timeDisplay: TimeDisplayComponent;

  time$: Observable<number>;
  percent$: Observable<number>;
  start$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  interval$: Observable<number>;
  reset$: Subject<void> = new Subject<void>();
  destroyed$: Subject<void> = new Subject<void>();

  _showEditor: boolean;
  get showEditor (){
    return this._showEditor;
  }

  set showEditor (value: boolean){
    this._showEditor = value;
    if(value){
      this.timerService.stop();
    }
  }

  //startTime: number = 5 + 1000 * 60 * 5;
  startTime: number = 0 + 1000 * 1 * 5;

  timerControl: FormControl;

  constructor(private cd: ChangeDetectorRef, private timerService: TimerService) {
    this.timerControl = new FormControl();
  }

  ngOnInit() {
    this.interval$ = timer(0, 10);

    this.timerService.timerReset$.subscribe(() => {
      this.resetTimer(this.startTime);
      this.timerService.stop();
      this.cd.markForCheck();
    });

    this.timerService.isRunning$.pipe(
      filter(start => start),
    ).subscribe(() => {
      this.showEditor = false;
    });
    this.timerControl.setValue(this.startTime);
    this.timerControl.valueChanges.subscribe(x => {
      this.showEditor = false;
      this.setTime(x);

    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  resetTimer(startTime: number) {
    this.reset$.next();
    this.timerService.end(false);

    this.time$ = this.timerService.isRunning$.pipe(
      switchMap(start => (start ? this.interval$.pipe(mapTo(10)) : EMPTY)),
      scan((acc, val) => acc - val, startTime),
      startWith(startTime),
      tap(val => {
        if (val === 0) {
          console.log('end timer');
          this.timerService.end(true);
        }
      }),
      takeUntil(this.reset$),
      takeWhile(val => val >= 0),
    );

    this.percent$ = this.time$.pipe(
      map(time => (1 - time / startTime) * 100),
    );
  }

  setTime(startTime: number) {
    this.startTime = startTime;
    this.resetTimer(this.startTime);
  }

}
