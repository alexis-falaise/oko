import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-city-display',
  templateUrl: './city-display.component.html',
  styleUrls: ['./city-display.component.scss']
})
export class CityDisplayComponent {
  @Input() city: string;
  @Input() country: string;
}
