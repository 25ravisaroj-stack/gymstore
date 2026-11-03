import { Component, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { filter } from 'rxjs';
import { Cart } from './core/services/cart';
import { ToastService } from './core/services/toast-service';

@Injectable({
  providedIn:"root"
})
@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('gym-store-ui');
  constructor(private cartS: Cart,private toast:ToastService) { }
  ngOnInit() {
    this.cartS.loadCart();
  }
}
