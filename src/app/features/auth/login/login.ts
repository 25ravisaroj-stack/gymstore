import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService }
from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);

  private authService =
    inject(AuthService);

  loginForm = this.fb.group({

    email: ['', Validators.required],

    password: ['', Validators.required]

  });

  login() {

    if (this.loginForm.invalid)
      return;

    this.authService.login(

      this.loginForm.value.email!,

      this.loginForm.value.password!

    );
    

  }

}