import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ValidatePhone(control: AbstractControl): ValidationErrors {
    const phone = control.value;
    if (phone) {
        const matches = phone.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/);
        return matches ? null : { validPhone: true };
    } else {
        return null;
    }
}
