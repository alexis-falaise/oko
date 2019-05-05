import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';

interface InstallStep {
  label: string;
  title: string;
  description: string;
  image: string;
  icon: string;
}

const chromeMobileSteps: Array<InstallStep> = [
  {
    label: 'openmenu',
    title: 'Ouvrez le menu',
    description: 'Cliquez sur les trois points à droite de la barre d\'adresse de Chrome',
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

const chromeSteps: Array<InstallStep> = [
  {
    label: 'openmenu',
    title: 'Ouvrez le menu',
    description: 'Cliquez sur les trois points à droite de la barre d\'adresse de Chrome',
    icon: 'more_vert',
    image: '',
  },
  {
    label: 'more',
    title: 'Plus d\'outils',
    description: 'Cliquez sur \'Plus d\'outils\'',
    icon: 'more_horiz',
    image: '',
  },
  {
    label: 'shortcut',
    title: 'Créez un raccourci',
    description: 'Cliquez sur \'Créer un raccourci\'',
    icon: 'screen_share',
    image: '',
  },
  {
    label: 'standalone',
    title: 'Mode application',
    description: 'Cochez \'Ouvrir dans une fenêtre\'',
    icon: 'aspect_ratio',
    image: '',
  },
  {
    label: 'done',
    title: 'ọkọ est installé',
    description: 'C\'est tout ! Lancez maintenant ọkọ directement depuis le Finder, dans le dossier Applications > Applications Chrome',
    icon: 'done_all',
    image: '',
  },
];

const iosSteps: Array<InstallStep> = [
  {
    label: 'openmenu',
    title: 'Ouvrez le menu',
    description: 'Appuyez sur l\'icône de partage au centre du menu Safari',
    icon: 'launch',
    image: '',
  },
  {
    label: 'addhome',
    title: 'Ajoutez à l\'écran d\'accueil',
    description: 'Sélectionnez \'Sur l\'écran d\'accueil\'',
    icon: 'add_box',
    image: '',
  },
  {
    label: 'save',
    title: 'Ajoutez à l\'écran d\'accueil',
    description: 'Appuyez sur ajouter',
    icon: 'save',
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

const firefoxMobileSteps = [
  {
    label: 'homebutton',
    title: 'Ajoutez à l\'écran d\'accueil',
    description: 'Appuyez sur le bouton \'Ajouter à l\'écran d\'accueil\', juste à droite de la barre d\'adresse',
    icon: 'home',
    image: '',
  },
  {
    label: 'addhome',
    title: 'Confirmez',
    description: 'Appuyez sur \'Ajouter à l\'écran d\'accueil',
    icon: 'add',
    image: '',
  },
  {
    label: 'done',
    title: 'ọkọ est installé',
    description: 'C\'est tout ! Lancez maintenant ọkọ directement depuis votre écran d\'accueil',
    icon: 'done_all',
    image: '',
  },
]

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss']
})
export class InstallComponent implements OnInit {
  selectedStep = 0;
  steps: Array<InstallStep>;

  constructor(
    private dialogRef: MatDialogRef<InstallComponent>,
    private deviceDetector: DeviceDetectorService) { }

  ngOnInit() {
    const browser = this.deviceDetector.browser;
    const os = this.deviceDetector.os;
    const device = this.deviceDetector.device;
    this.steps = chromeMobileSteps;
    if (browser === 'Chrome' && os !== 'Android') {
      this.steps = chromeSteps;
    }
    if (browser === 'Safari') {
      if (os === 'iOS' || device === 'iPad') {
        this.steps = iosSteps;
      }
    }
    if (browser === 'Firefox') {
      this.steps = firefoxMobileSteps;
    }
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
