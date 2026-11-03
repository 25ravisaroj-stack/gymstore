import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {NavbarComponent} from '../../shared/components/navbar/navbar'
import {FooterComponent } from '../../shared/components/footer/footer'
import {FooterVideoPlayer } from '../../shared/components/footer-video-player/footer-video-player'
import { ProductListComponent } from '../../features/products/product-list/product-list';
import { filter } from 'rxjs';

@Component({
  imports: [RouterOutlet,NavbarComponent,FooterComponent,FooterVideoPlayer ],
  selector: 'app-main-layout',
  standalone: true,
  styleUrl: './main-layout.scss',
  templateUrl: './main-layout.html',
})
export class MainLayout {


showFooter = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        const hideFooterRoutes = ['/videos','/cart','/product-details'];

        this.showFooter = !hideFooterRoutes.some(route =>
          this.router.url.startsWith(route)
        );
      });
  }


}
