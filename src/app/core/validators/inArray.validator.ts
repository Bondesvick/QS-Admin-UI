import { AbstractControl } from '@angular/forms';

export function inArrayValidator(arrayToCheck: any) {
  return function (control: AbstractControl): { [key: string]: any } | null {
    return arrayToCheck.includes(control.value + '')
      ? null
      : { inArray: { value: control.value } };
  };
}
