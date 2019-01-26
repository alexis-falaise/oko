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
