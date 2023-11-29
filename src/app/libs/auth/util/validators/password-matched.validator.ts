import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';

export const passwordMatches = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = (control as FormGroup).controls['password'].value;
    const confirmPassword = (control as FormGroup).controls['confirmPassword']
      .value;

    if (
      password === confirmPassword &&
      password != null &&
      confirmPassword != null
    ) {
      return null;
    }
    return { passwordNotMatching: true };
  };
};
