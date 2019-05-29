import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() icon = 'menu';
  @Input() title = 'App Template';

  @Output() changeNavigationMode = new EventEmitter<void>();

  constructor() {}

  handleAction() {
    this.changeNavigationMode.emit();
  }
}
