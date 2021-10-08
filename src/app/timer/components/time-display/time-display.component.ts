import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { TimeConstants } from '../../models/timer.models';

@Component({
  selector: 'app-time-display',
  templateUrl: './time-display.component.html',
  styleUrls: ['./time-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeDisplayComponent implements OnInit {

  @Input() time: number = (12 * TimeConstants.hourInMs) + (34 * TimeConstants.minuteInMs) + (56 * 1000) + 780;
  @Input() showHundriths: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  get hours(): number {
    return Math.floor(this.time / TimeConstants.hourInMs);
  }

  get minutes(): number {
    return Math.floor((this.time / TimeConstants.minuteInMs) % 60);
  }

}
