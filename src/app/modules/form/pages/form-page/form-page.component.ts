import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormPageComponent implements OnInit {

  form: FormGroup;
  error$ = this.addressService.error;

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private addressService: AddressService) { }

  ngOnInit() {
    this.form = this.fb.group({
      lastName: [null, Validators.required],
      firstName: [null, Validators.required],
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

  isFilled(name: string): boolean {
    return !!this.form.get(name).value;
  }

  clear(name: string): void {
    return this.form.get(name).setValue(null);
  }

  search(zipcode: string): void {
    if (zipcode.length !== 7) {
      return;
    }

    this.addressService.search(zipcode);
  }

  handleSubmit(event): void {
    console.log(this.form);
  }
}
