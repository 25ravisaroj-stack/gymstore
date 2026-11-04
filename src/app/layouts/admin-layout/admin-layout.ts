import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from '../../shared/components/navbar/navbar';

@Component({
  imports: [RouterOutlet,NavbarComponent],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.scss',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {



showFooter = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {

        const hideFooterRoutes = ['/videos','/cart','/product-details'];

        this.showFooter = !hideFooterRoutes.some(route =>
          this.router.url.startsWith(route)
        );
      });
  }

}
