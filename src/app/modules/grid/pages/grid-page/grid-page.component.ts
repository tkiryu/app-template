import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IgxOverlayService, OverlayCancelableEventArgs, OverlayEventArgs, ISelectionEventArgs } from 'igniteui-angular';

import { NavigationQuery } from 'src/app/states/navigation';
import { SearchQuery, SearchService } from '../../states/search';
import { GridQuery, GridService } from '../../states/grid';
import { SearchCondition, SearchResult, ItemToChange } from '../../models';

import { GridComponent, ColumnSettingsComponent, UrlInputComponent } from '../../components';

@Component({
  selector: 'app-grid-page',
  templateUrl: './grid-page.component.html',
  styleUrls: ['./grid-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridPageComponent implements OnInit, AfterViewInit, OnDestroy {

  searchCondition$ = this.searchQuery.searchCondition$;

  searchResult$ = this.searchQuery.searchResult$;

  isLoading$ = this.gridQuery.selectLoading();

  data$ = this.gridQuery.data$;

  columns$ = this.gridQuery.columns$;

  extension = '';

  @ViewChild('grid', { static: true }) grid: GridComponent;

  private overlayId: string;

  private destroy$ = new Subject<boolean>();

  constructor(
    private navigationQuery: NavigationQuery,
    private searchQuery: SearchQuery,
    private searchService: SearchService,
    private gridQuery: GridQuery,
    private gridService: GridService,
    private overlayService: IgxOverlayService
  ) { }

  ngOnInit() {
    const url = this.gridQuery.getValue().ui.url;
    this.gridService.loadDataFromUrl(url);

    this.overlayService.onOpening
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayCancelableEventArgs) => {
        if (event.id !== this.overlayId) {
          return;
        }
        if (event.componentRef.instance instanceof ColumnSettingsComponent) {
          const id = this.gridQuery.getValue().ids[0];
          const sampleData = this.gridQuery.getEntity(id);
          const columns = this.gridQuery.getValue().ui.columns;
          const columnSettings = columns.map(column => {
            return {
              ...column,
              sampleValue: sampleData[column.field]
            };
          });
          const subs: Subscription[] = [];
          const settings = event.componentRef.instance;
          settings.columnSettings = columnSettings;
          subs.push(settings.cancel
            .subscribe(() => {
              subs.forEach(sub => sub.unsubscribe());
              this.overlayService.hide(this.overlayId);
            }));
          subs.push(settings.commit
            .subscribe(newColumns => {
              this.overlayService.hide(this.overlayId);
              subs.forEach(sub => sub.unsubscribe());

              const data = this.gridQuery.getAll();
              this.gridService.changeDataTypes(data, newColumns);
            }));
        } else if (event.componentRef.instance instanceof UrlInputComponent) {
          const urlInput = event.componentRef.instance;
          urlInput.url = this.gridQuery.getValue().ui.url;
          const sub = urlInput.commit.subscribe((url: string) => {
            this.overlayService.hide(this.overlayId);
            sub.unsubscribe();

            this.gridService.loadDataFromUrl(url);
          });
        }
      });

    this.overlayService.onClosed
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayEventArgs) => {
        if (event.id === this.overlayId) {
          this.overlayId = null;
        }
      });
  }

  ngAfterViewInit() {
    // TODO: remove when calculation will be OK.
    // https://github.com/IgniteUI/igniteui-angular/issues/4952
    this.navigationQuery.mode$.subscribe(() => this.grid.calculateGridSizes());
  }

  ngOnDestroy() {
    this.gridService.removeData();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSearch(searchCondition: SearchCondition): void {
    this.searchService.updateSearchCondition(searchCondition);
  }

  onSearchResult(searchResult: SearchResult): void {
    this.searchService.updateSearchResult(searchResult);
  }

  onSelectImportType(event: ISelectionEventArgs, input: HTMLInputElement): void {
    const type = event.newSelection.value;
    if (type === 'url') {
      // TODO: URL 入力ダイアログを表示する
      this.showUrlInput();
    } else {
      // ファイルダイアログを表示する
      this.extension = event.newSelection.value;
      input.accept = this.extension;
      input.click();
    }
  }

  async onImportFromFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files.length !== 1) {
      alert('複数ファイルは読み込めません');
      return;
    }

    const file = input.files[0];
    await this.gridService.loadDataFromFile(file, this.extension);
  }

  async onImportFromUrl(url: string) {
    await this.gridService.loadDataFromUrl(url);
  }

  onChangeData(dataToChange: ItemToChange[]): void {
    this.gridService.changeData(dataToChange);
  }

  onShowColumnSettings(): void {
    if (!this.overlayId) {
      this.overlayId = this.overlayService.attach(ColumnSettingsComponent);
    }
    this.overlayService.show(this.overlayId);
  }

  private showUrlInput(): void {
    if (!this.overlayId) {
      this.overlayId = this.overlayService.attach(UrlInputComponent);
    }
    this.overlayService.show(this.overlayId);
  }
}
