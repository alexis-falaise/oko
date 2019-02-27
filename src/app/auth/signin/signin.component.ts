import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidationErrors, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '@core/auth.service';
import { Router } from '@angular/router';



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
    password: ['', [
      Validators.required,
      Validators.minLength(8)
    ]],
    passwordConfirm: ['', [
      Validators.required,
      Validators.minLength(8),
    ]],
  }, {validator: this.passwordMatch});
  validForm = false;
  validated = false;
  signinError = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  validate() {
    this.validated = true;
  }

  onSubmit() {
    this.loading = true;
    this.signinError = false;
    this.authService.signin(this.signinForm.value)
    .subscribe((signInfo: any) => {
      this.loading = false;
      this.signinError = signInfo.code === 'BODY_ERROR';
      if (signInfo.status) {
        this.authService.login(this.signinForm.value.email, this.signinForm.value.password);
      }
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  private passwordMatch(control: AbstractControl): ValidationErrors {
      const firstpass = control.get('password');
      const secondpass = control.get('passwordConfirm');
      return firstpass === secondpass ? { 'passwordMismatch': true } : null;
  }
}
