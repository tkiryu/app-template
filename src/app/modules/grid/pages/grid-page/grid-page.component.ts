import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { NavigationQuery } from 'src/app/states/navigation';
import { IOutputData } from 'angular-split/lib/interface';
import { GridQuery, GridService } from '../../state';
import { SearchCondition, SearchResult } from '../../models';
import { GridComponent } from '../../components';

@Component({
  selector: 'app-grid-page',
  templateUrl: './grid-page.component.html',
  styleUrls: ['./grid-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridPageComponent implements OnInit, AfterViewInit {
  isLoading$ = this.gridQuery.selectLoading();

  data$ = this.gridQuery.data$;

  columns$ = this.gridQuery.columns$;

  searchCondition$ = this.gridQuery.searchCondition$;

  searchResult$ = this.gridQuery.searchResult$;

  showDetailArea: boolean;

  detailItem: any;

  @ViewChild('grid') grid: GridComponent;

  constructor(
    private gridQuery: GridQuery,
    private gridService: GridService,
    private navigationQuery: NavigationQuery
  ) {}

  ngOnInit() {
    this.gridService.loadData();
  }

  ngAfterViewInit() {
    this.navigationQuery.mode$.subscribe(() => this.grid.reflow());
  }

  onDragEnd(event: IOutputData): void {
    this.grid.reflow();
  }

  onSearch(searchCondition: SearchCondition): void {
    this.gridService.updateSearchCondition(searchCondition);
  }

  onSearchResult(searchResult: SearchResult) {
    this.gridService.updateSearchResult(searchResult);
  }

  onSelectItem(item: any): void {
    this.showDetailArea = true;
    this.detailItem = item;
  }

  onChangeData(dataToUpdate: any[]) {
    // const originalData = this.gridQuery.getValue().data;
    // for
    // this.gridService.updateData(data);
  }

  hideDetail(event): void {
    this.showDetailArea = false;
    this.detailItem = null;
  }
}
