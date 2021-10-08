import { Pipe, PipeTransform } from '@angular/core';
import { TimeConstants } from '../models/timer.models';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: number, format?: string): any {
    if(format === 'hours'){
      const hours = Math.floor(value / TimeConstants.hourInMs);
      return hours.toString().padStart(2, '0');
    }
    if(format === 'minutes'){
      const minutes = Math.floor((value / TimeConstants.minuteInMs) % 60);
      return minutes.toString().padStart(2, '0');
    }
    if(format === 'seconds'){
      const seconds = Math.floor((value / TimeConstants.secondInMs) % 60);
      return seconds.toString().padStart(2, '0');
    }
    if(format === 'hundriths'){
      const hundriths = Math.floor((value / 10) % 100);
      return hundriths.toString().padStart(2, '0');
    }
    return value;
  }

}
