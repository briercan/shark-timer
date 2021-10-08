import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TimeConstants } from '../../models/timer.models';

@Component({
  selector: 'app-time-editor',
  templateUrl: './time-editor.component.html',
  styleUrls: ['./time-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: TimeEditorComponent
    }
  ]
})
export class TimeEditorComponent implements OnInit, ControlValueAccessor  {



  onChange = (time: number) => {}
  onTouched = () => {}
  @Output() setTime = new EventEmitter<number>();
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      inputHours: [0],
      inputMinutes: [0],
      inputSeconds: [0],
    })
   }


  ngOnInit() {
  }

  endSetTime() {
    const value = this.formGroup.value;
    var timeValue = value.inputHours * TimeConstants.hourInMs + value.inputMinutes * TimeConstants.minuteInMs + value.inputSeconds * TimeConstants.secondInMs;
    this.onChange(timeValue);

  }
  inputChange(hours: number, minutes: number, seconds: number) {

    const timeVal = hours * TimeConstants.hourInMs + minutes * TimeConstants.minuteInMs + seconds * TimeConstants.secondInMs;
    this.setTime.emit(timeVal);
  }

  writeValue(time: number): void {
    this.formGroup.get('inputHours').setValue(Math.floor(time / TimeConstants.hourInMs));
    this.formGroup.get('inputMinutes').setValue(Math.floor((time / TimeConstants.minuteInMs) % 60));
    this.formGroup.get('inputSeconds').setValue(Math.floor((time / TimeConstants.secondInMs) % 60));
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {

  }


}
