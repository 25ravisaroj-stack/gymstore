import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  private fb = inject(FormBuilder);

  private authService =
    inject(AuthService);

  registerForm = this.fb.group({
    name:['', Validators.required],
    email:['', Validators.required],
    password:['', Validators.required]
  });

  register(){

    if(this.registerForm.invalid)
      return;

    this.authService.register(
      this.registerForm.value
    );
  }

}