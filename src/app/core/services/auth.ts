import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private api = 'http://localhost:3000/users';

  register(user: any) {

    this.http.post(this.api, user)
      .subscribe(() => {

        alert('Registration Successful');

        this.router.navigate(['/login']);

      });

  }

  login(email: string, password: string) {
console.log(`${this.api}?email=${email}&password=${password}`)
    this.http.get<any[]>(
      `${this.api}?email=${email}&password=${password}`
    )
    .subscribe(users => {

      if (users.length > 0) {

        localStorage.setItem(
          'token',
          'gym-token'
        );

        localStorage.setItem(
          'user',
          JSON.stringify(users[0])
        );

        this.router.navigate(['/']);
      }
      else {

        alert('Invalid Credentials');

      }

    });

  }

  logout() {

    localStorage.clear();

    this.router.navigate(['/login']);

  }

  isLoggedIn(): boolean {

    return !!localStorage.getItem('token');

  }
}