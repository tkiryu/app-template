import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';

import { StateHistoryPlugin } from '@datorama/akita';

import { IOutputData } from 'angular-split/lib/interface';

import { NavigationQuery } from 'src/app/states/navigation';
import { SearchQuery, SearchService } from '../../states/search';
import { GridQuery, GridService } from '../../states/grid';
import { SearchCondition, SearchResult, ItemToUpdate } from '../../models';

import { GridComponent } from '../../components';

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

  gridDataHistory = new StateHistoryPlugin(this.gridQuery);

  @ViewChild('grid') grid: GridComponent;

  constructor(
    private navigationQuery: NavigationQuery,
    private searchQuery: SearchQuery,
    private searchService: SearchService,
    private gridQuery: GridQuery,
    private gridService: GridService
  ) {}

  ngOnInit() {
    this.gridDataHistory.ignoreNext();
    this.gridService.loadData();
  }

  ngAfterViewInit() {
    // TODO: remove when calculation will be OK.
    // https://github.com/IgniteUI/igniteui-angular/issues/4952
    this.navigationQuery.mode$.subscribe(() => this.grid.calculateGridSizes());
  }

  ngOnDestroy() {
    this.gridDataHistory.destroy(true);
    this.gridService.removeData();
  }

  onDragEnd(event: IOutputData): void {
    this.grid.calculateGridSizes();
  }

  onSearch(searchCondition: SearchCondition): void {
    this.searchService.updateSearchCondition(searchCondition);
  }

  onSearchResult(searchResult: SearchResult) {
    this.searchService.updateSearchResult(searchResult);
  }

  onLoadData(dataToLoad: any[]) {
    this.gridService.setData(dataToLoad);
  }

  onUpdateData(dataToUpdate: ItemToUpdate[]) {
    this.gridService.updateData(dataToUpdate);
  }

  onUndo(): void {
    this.gridDataHistory.undo();
  }

  onRedo(): void {
    this.gridDataHistory.redo();
  }
}
