import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { ActiveClockService } from '../../services/active-clock.service';
import { TimerState } from '../../services/timer.service';

@Component({
    selector: 'app-timer-controls',
    templateUrl: './timer-controls.component.html',
    styleUrls: ['./timer-controls.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerControlsComponent implements OnInit {
    @ViewChild('alarm') alarmElementRef: ElementRef;
    @Input() timerActive: boolean;

    toggleButtonText$: Observable<string>;

    alarm: HTMLAudioElement;
    alarmEnabled$ = new BehaviorSubject<boolean>(true);
    alarmSounding$ = new BehaviorSubject<boolean>(false);

    fullScreen$ = new BehaviorSubject<boolean>(false);

    constructor(private activeClockService: ActiveClockService) {}

    ngOnInit() {
        this.alarm = this.alarmElementRef.nativeElement;
        this.toggleButtonText$ = this.activeClockService.getState().pipe(
            map((x) => {
                if (x === TimerState.Stopped) {
                    return 'Start';
                } else if (x === TimerState.Running) {
                    return 'Stop';
                } else if (x === TimerState.Complete) {
                    return 'End';
                }
            }),
        );
    }

    startStop() {
        this.activeClockService.toggle();
    }

    start() {
        this.activeClockService.start();
    }

    stop() {
        this.activeClockService.stop();
    }

    reset() {
        this.activeClockService.reset();
    }

    end(timerComplete: boolean) {
        this.activeClockService.end(timerComplete);
    }

    toggleAlarm() {
        this.alarmEnabled$.next(!this.alarmEnabled$.value);
    }

    startAlarm() {
        if (this.alarmEnabled$.value && !this.alarmSounding$.value) {
            this.alarmSounding$.next(true);
            this.alarm.play();
        }
    }

    stopAlarm() {
        if (this.alarmEnabled$.value && this.alarmSounding$.value) {
            this.alarmSounding$.next(false);
            this.alarm.pause();
        }
    }

    toggleFullscreen() {
        this.fullScreen$.next(!this.fullScreen$.value);
    }
}
