import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DisplayDensityToken, DisplayDensity, IListItemClickEventArgs, IgxSnackbarComponent } from 'igniteui-angular';

import { AddressService } from '../../services/address.service';
import { GridQuery, GridService } from 'src/app/states/grid';
import { ID_KEY } from '../../../../constant';
import { DatePipe } from '@angular/common';
import { ItemToChange, ChangeType, Item } from 'src/app/models';
import { ID } from '@datorama/akita';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
  providers: [{ provide: DisplayDensityToken, useValue: { displayDensity: DisplayDensity.compact } }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormPageComponent implements OnInit {

  data$ = this.gridQuery.data$;

  valueKey = ID_KEY;

  displayKey = '';

  form: FormGroup;

  error$ = this.addressService.error;

  updating = false;

  @ViewChild('snackbar', { static: true }) snackbar: IgxSnackbarComponent;

  private selectedId: ID;

  constructor(
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private gridQuery: GridQuery,
    private gridService: GridService,
    private fb: FormBuilder,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      lastName: [null, Validators.required],
      firstName: [null, Validators.required],
      gender: [null, Validators.required],
      birthday: [null, Validators.required],
      zipcode: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null],
      email: [null]
    });

    this.addressService.address.subscribe(address => {
      const addressForm = this.form.get('address');
      addressForm.patchValue(address);
      this.cdr.markForCheck();
    });
  }

  onItemClicked(event: IListItemClickEventArgs): void {
    console.log(event);
    this.selectedId = this.gridQuery.getValue().ids[event.item.index];
    const item = this.gridQuery.getEntity(this.selectedId);
    this.form.patchValue({
      lastName: item['姓'],
      firstName: item['名'],
      gender: item['性別'],
      birthday: new Date(item['生年月日']),
      zipcode: item['郵便番号'],
      address: item['住所'],
      phone: item['携帯電話'],
      email: item['メールアドレス']
    });
  }

  isSelected(item: Item): boolean {
    return item[ID_KEY] === this.selectedId;
  }

  isFilled(name: string): boolean {
    return !!this.form.get(name).value;
  }

  clear(name: string): void {
    return this.form.get(name).setValue(null);
  }

  search(zipcode: string): void {
    if (zipcode.replace('-', '').length !== 7) {
      return;
    }

    this.addressService.search(zipcode);
  }

  onSubmit(event): void {
    console.log(this.form);
    const rawValue = this.form.getRawValue();
    const item: ItemToChange = {
      id: this.selectedId,
      type: ChangeType.Update,
      value: {
        '姓': rawValue.lastName,
        '名': rawValue.firstName,
        '性別': rawValue.gender,
        '生年月日': this.datePipe.transform(rawValue.birthday),
        '郵便番号': rawValue.zipcode,
        '住所': rawValue.address,
        '携帯電話': rawValue.phone,
        'メールアドレス': rawValue.email,
      }
    };
    this.gridService.changeItem(item);

    this.snackbar.show();
  }
}
