import { Directive, AfterViewInit, OnDestroy, NgZone, Host, Self, Output, EventEmitter } from '@angular/core';

import { Subject, fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { IgxGridComponent } from 'igniteui-angular';

@Directive({
  selector: '[appUndoRedo]'
})
export class UndoRedoDirective implements AfterViewInit, OnDestroy {

  @Output() undo = new EventEmitter<void>();

  @Output() redo = new EventEmitter<void>();

  private destroy$ = new Subject<boolean>();

  constructor(private zone: NgZone, @Host() @Self() private grid: IgxGridComponent) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const keydown$ = fromEvent<KeyboardEvent>(this.grid.nativeElement, 'keydown');

      keydown$.pipe(
        filter(event => event.ctrlKey && event.key.toLowerCase() === 'z' && !event.repeat),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        event.preventDefault();
        this.zone.run(() => this.undo.emit());
      });

      keydown$.pipe(
        filter(event => event.ctrlKey && event.key.toLowerCase() === 'y' && !event.repeat),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        event.preventDefault();
        this.zone.run(() => this.redo.emit());
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
