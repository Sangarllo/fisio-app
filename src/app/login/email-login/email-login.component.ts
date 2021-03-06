import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent implements OnInit {
  loginForm: FormGroup;

  type: 'login' | 'signup' | 'reset' = 'login';
  loading = false;

  serverMessage: string;

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.minLength(6), Validators.required]
      ],
      passwordConfirm: ['', []]
    });
  }

  changeType(val): void {
    this.type = val;
  }

  get isLogin(): boolean {
    return this.type === 'login';
  }

  get isSignup(): boolean {
    return this.type === 'signup';
  }

  get isPasswordReset(): boolean {
    return this.type === 'reset';
  }

  // eslint-disable-next-line
  get email() {
    return this.loginForm.get('email');
  }

  // eslint-disable-next-line
  get password() {
    return this.loginForm.get('password');
  }

  // eslint-disable-next-line
  get passwordConfirm() {
    return this.loginForm.get('passwordConfirm');
  }

  get passwordDoesMatch(): boolean {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  // eslint-disable-next-line
  async onSubmit() {
    this.loading = true;

    console.log(`onSubmit()`);
    console.log(`isPasswordReset: ${this.isPasswordReset}`);

    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        await this.afAuth.signInWithEmailAndPassword(email, password);
        if ( this.afAuth.user ) {
          const currentUser = await this.afAuth.currentUser;
          const desc = `${currentUser.displayName} (${currentUser.email})`;
          this.router.navigate([`home`]);
        }
      }
      if (this.isSignup) {
        await this.afAuth.createUserWithEmailAndPassword(email, password);
      }
      if (this.isPasswordReset) {
        await this.afAuth.sendPasswordResetEmail(email);
        this.serverMessage = 'Revisa tu correo electr??nico';
      }
    } catch (err) {
      this.serverMessage = err;
    }

    this.loading = false;
  }
}
