import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-remove-panel',
  templateUrl: './remove-panel.component.html',
  styleUrls: ['./remove-panel.component.scss']
})
export class RemovePanelComponent implements OnInit {
  @Output() remove = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  removeEvent() {
    this.remove.emit();
  }

}
