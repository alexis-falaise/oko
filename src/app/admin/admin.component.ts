import { Component, OnInit } from '@angular/core';
import { Link } from '@models/link.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  categories: Array<Link> = [
    { label: 'Utilisateurs', path: '/admin/user', icon: 'perm_identity' },
    { label: 'Trajets', path: '/admin/trip', icon: 'explore' },
    { label: 'Annonces', path: '/admin/request', icon: 'new_releases' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
