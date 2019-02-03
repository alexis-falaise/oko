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
    { label: 'Mon compte', path: '/account', icon: 'account_circle' },
    { label: 'Déconnexion', path: '/logout', icon: 'power_settings_new' }
  ];
  menuItems: Array<MenuItem> = [
    { label: 'Accueil', path: '/home', icon: 'home' },
    { label: 'Créer une annonce', path: '/post/request', icon: 'new_releases' },
    { label: 'Mes trajets', path: '/trips', icon: 'explore' },
    { label: 'Messages', path: '/messages', icon: 'email' },
    { label: 'Proposer un trajet', path: '/post/trip/new', icon: 'flight_takeoff' },
    { label: 'Aide', path: '/help', icon: 'help' },
  ];
  displayAccountMenuItems: Array<MenuItem> = null;
  secondaryMenuItems: Array<MenuItem> = [];
  logged = false;

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
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
    this.historyService.onHistory()
    .subscribe(history => {
      this.previousAvailable = history.length > 1;
    });
  }

  toggleMenu() {
    this.menuDisplay = !this.menuDisplay;
  }

  back() {
    this.historyService.back();
  }


}
