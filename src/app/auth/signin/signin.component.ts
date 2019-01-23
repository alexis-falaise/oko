import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidationErrors, FormGroup } from '@angular/forms';
import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', Validators.compose([
      Validators.required,
      Validators.email
    ])],
    password: ['', Validators.compose([
      Validators.required,
      Validators.minLength(8)
    ])],
    passwordConfirm: ['', Validators.compose([
      Validators.required,
      Validators.minLength(8),
    ])],
  }, {
    validators: this.passwordMatch,
  });
  validForm = false;
  validated = false;
  signinError = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  validate() {
    this.validated = true;
  }

  onSubmit() {
    this.loading = true;
    this.authService.signin(this.signinForm.value)
    .subscribe((signInfo: any) => {
      console.log(signInfo);
      console.log(typeof signInfo.code);
      this.loading = false;
      this.signinError = signInfo.code === 'BODY_ERROR';
    });
  }

  private passwordMatch(form: FormGroup): ValidationErrors {
    const firstpass = form.get('password');
    const secondpass = form.get('passwordConfirm');
    return firstpass === secondpass ? { 'passwordMismatch': true } : null;
  }

}
