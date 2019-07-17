import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UrlInputComponent {

  @Input() url: string;

  @Output() commit = new EventEmitter<string>();

  clear(): void {
    this.url = '';
  }

  onCommit(): void {
    this.commit.emit(this.url);
  }
}
