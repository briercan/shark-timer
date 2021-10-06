import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  //TODO: DRY
  private hourInMs = 3600000;
  private minuteInMs = 60000;
  private secondInMs = 1000;

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
    var timeValue = value.inputHours * this.hourInMs + value.inputMinutes * this.minuteInMs + value.inputSeconds * this.secondInMs;
    this.onChange(timeValue);

  }
  inputChange(hours: number, minutes: number, seconds: number) {

    const timeVal = hours * this.hourInMs + minutes * this.minuteInMs + seconds * this.secondInMs;
    this.setTime.emit(timeVal);
  }

  writeValue(time: number): void {
    this.formGroup.get('inputHours').setValue(Math.floor(time / this.hourInMs));
    this.formGroup.get('inputMinutes').setValue(Math.floor((time / this.minuteInMs) % 60));
    this.formGroup.get('inputSeconds').setValue(Math.floor((time / this.secondInMs) % 60));
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
