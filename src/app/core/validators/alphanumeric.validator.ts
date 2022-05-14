import { AbstractControl } from '@angular/forms';
import isAlphanumeric from 'validator/es/lib/isAlphanumeric';

export function alphanumericValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  return isAlphanumeric(control.value + '')
    ? null
    : { alphanumeric: { value: control.value } };
}
