import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

interface Address {
  code: number;
  data: {
    pref: string;
    address: string;
    city: string;
    town: string;
    fullAddress: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  address = new Subject<string>();
  error = new Subject<boolean>();
  constructor(private httpClient: HttpClient) {}

  search(zipcode: string): void {
    this.httpClient
      .get<Address>(`https://api.zipaddress.net/?zipcode=${zipcode}`)
      .subscribe(res => {
        if (res.code === 200) {
          this.address.next(res.data.fullAddress);
          this.error.next(false);
        } else {
          this.address.next('');
          this.error.next(true);
        }
      });
  }
}
