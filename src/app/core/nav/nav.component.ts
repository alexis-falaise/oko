import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

import { MenuItem } from '@models/app/menu-item.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  menuDisplay = false;
  previousAvailable = false;
  menuItems: Array<MenuItem> = [
    { label: 'Accueil', path: '/home' },
    { label: 'Créer une annonce', path: '/post/request' },
    { label: 'Mes trajets', path: '/trips' },
    { label: 'Messages', path: '/messages' },
    { label: 'Rentabiliser un trajet', path: '/post/trip' },
    { label: 'Aide', path: '/help' },
    { label: 'Mon compte', path: '/account' },
    { label: 'Déconnexion', path: '/logout' },
  ];

  secondaryMenuItems: Array<MenuItem> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // check if child route
        console.log('Nav check', event);
      }
    });
  }

  toggleMenu() {
    this.menuDisplay = !this.menuDisplay;
  }


}
