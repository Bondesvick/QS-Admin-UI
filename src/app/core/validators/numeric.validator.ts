import { AbstractControl } from '@angular/forms';
import isNumeric from 'validator/es/lib/isNumeric';

export function numericValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  return isNumeric(control.value + '')
    ? null
    : { numeric: { value: control.value } };
}
