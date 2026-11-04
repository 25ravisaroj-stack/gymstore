import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart } from '../../../core/services/cart';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {

constructor(private cartService:Cart){}

}
