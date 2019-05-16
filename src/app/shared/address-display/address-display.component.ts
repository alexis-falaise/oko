import { Component, Input } from '@angular/core';
import { MeetingPoint } from '@models/meeting-point.model';

@Component({
  selector: 'app-address-display',
  templateUrl: './address-display.component.html',
  styleUrls: ['./address-display.component.scss']
})
export class AddressDisplayComponent {
  @Input() meetingPoint: MeetingPoint;
}
