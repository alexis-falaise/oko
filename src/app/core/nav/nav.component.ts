import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

import { AuthService } from '@core/auth.service';
import { HistoryService } from '@core/history.service';

import { MenuItem } from '@models/app/menu-item.model';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  menuDisplay = false;
  previousAvailable = false;
  guestAccountMenuItems: Array<MenuItem> = [
    { label: 'Connexion', path: '/login', icon: 'power_settings_new' },
  ];
  accountMenuItems: Array<MenuItem> = [
    { label: 'Mon compte', path: '/account/info', icon: 'account_circle' },
    { label: 'Mes trajets', path: '/account/trip', icon: 'explore' },
    { label: 'Mes demandes', path: '/account/request', icon: 'new_releases' },
    { label: 'Déconnexion', path: '/logout', icon: 'power_settings_new' }
  ];
  menuItems: Array<MenuItem> = [
    { label: 'Accueil', path: '/home', icon: 'home' },
    { label: 'Faire une demande', path: '/post/request/new', icon: 'new_releases' },
    { label: 'Proposer un trajet', path: '/post/trip/new', icon: 'flight_takeoff' },
    { label: 'Messages', path: '/messages', icon: 'email' },
    { label: 'Aide', path: '/help', icon: 'help' },
  ];
  displayAccountMenuItems: Array<MenuItem> = null;
  secondaryMenuItems: Array<MenuItem> = [];
  logged = false;

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private router: Router,
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
    this.historyService.onHistory()
    .subscribe(history => {
      this.previousAvailable = history.length > 1;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.authService.getLoginStatus();
      }
    });
  }

  toggleMenu() {
    this.menuDisplay = !this.menuDisplay;
  }

  back() {
    this.historyService.back();
  }


}
