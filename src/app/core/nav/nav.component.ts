import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

import { MenuItem } from '@models/app/menu-item.model';
import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  menuDisplay = false;
  previousAvailable = false;
  guestAccountMenuItems: Array<MenuItem> = [
    { label: 'Connexion', path: '/login' },
  ];
  accountMenuItems: Array<MenuItem> = [
    { label: 'Mon compte', path: '/account' },
    { label: 'Déconnexion', path: '/logout' }
  ];
  menuItems: Array<MenuItem> = [
    { label: 'Accueil', path: '/home' },
    { label: 'Créer une annonce', path: '/post/request' },
    { label: 'Mes trajets', path: '/trips' },
    { label: 'Messages', path: '/messages' },
    { label: 'Je voyage', path: '/post/trip' },
    { label: 'Aide', path: '/help' },
  ];
  displayAccountMenuItems: Array<MenuItem> = null;
  secondaryMenuItems: Array<MenuItem> = [];
  logged = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.authService.onStatus()
    .subscribe(status => {
      if (status && status.status) {
        this.displayAccountMenuItems = this.accountMenuItems;
      } else {
        this.displayAccountMenuItems = this.guestAccountMenuItems;
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.authService.getLoginStatus();
        // check if child route
        console.log('Nav check', event);
      }
    });
  }

  toggleMenu() {
    this.menuDisplay = !this.menuDisplay;
  }


}
