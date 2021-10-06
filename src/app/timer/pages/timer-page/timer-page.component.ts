import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ClockType } from '../../models/timer.models';
import { ActiveClockService } from '../../services/active-clock.service';

@Component({
  selector: 'app-timer-page',
  templateUrl: './timer-page.component.html',
  styleUrls: ['./timer-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPageComponent implements OnInit, OnDestroy {
  selectedTabIndex$ = new BehaviorSubject<number>(0);
  destroyed$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private activeClockService: ActiveClockService) { }

  ngOnInit() {
    this.route.data.pipe(
      filter(routeData => !!routeData),
      takeUntil(this.destroyed$),
    ).subscribe(routeData => {
      if (routeData.view === 'timer') {
        this.selectedTabIndex$.next(0);
      } else if (routeData.view === 'stopwatch') {
        this.selectedTabIndex$.next(1);
      }
    });

    this.selectedTabIndex$
    .pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe(idx => {
      if(idx === 0){
        this.activeClockService.setActiveClock(ClockType.Timer);
      } else {
        this.activeClockService.setActiveClock(ClockType.Stopwatch);
      }
    })
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  tabChange(selectedTabIndex: number) {
    this.selectedTabIndex$.next(selectedTabIndex);
  }


}
