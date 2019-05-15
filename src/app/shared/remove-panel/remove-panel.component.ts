import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-remove-panel',
  templateUrl: './remove-panel.component.html',
  styleUrls: ['./remove-panel.component.scss']
})
export class RemovePanelComponent implements OnInit {
  @Input() editable = false;
  @Input() display = false;
  @Output() remove = new EventEmitter();
  @Output() edit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  editItem() {
    this.edit.emit();
  }

  removeItem() {
    this.remove.emit();
  }

}
