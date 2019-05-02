import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

interface InstallStep {
  label: string;
  title: string;
  description: string;
  image: string;
  icon: string;
}

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss']
})
export class InstallComponent implements OnInit {
  selectedStep = 0;
  steps: Array<InstallStep>;

  constructor(private dialogRef: MatDialogRef<InstallComponent>) { }

  ngOnInit() {
    this.steps = [
      {
        label: 'openmenu',
        title: 'Ouvrez le menu',
        description: 'Cliquez sur les trois points à droite de la barre d\'adresse',
        icon: 'more_vert',
        image: '',
      },
      {
        label: 'addhome',
        title: 'Ajoutez à l\'écran d\'accueil',
        description: 'Sélectionnez \'Ajouter à l\'écran d\'accueil\'',
        icon: 'add_circle_outline',
        image: '',
      },
      {
        label: 'done',
        title: 'ọkọ est installé',
        description: 'C\'est tout ! Lancez maintenant ọkọ directement depuis votre écran d\'accueil',
        icon: 'done_all',
        image: '',
      },
    ];
  }

  previous() {
    if (this.selectedStep > 0) {
      this.selectedStep -= 1;
    }
  }

  next() {
    if (this.selectedStep < this.steps.length - 1) {
      this.selectedStep += 1;
    } else {
      this.close();
    }
  }

  close() {
    this.dialogRef.close();
  }

}
