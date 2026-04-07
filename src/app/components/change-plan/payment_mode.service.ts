import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';


import { Observable, of, throwError } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';


// URL to web api
const baseApiUrl = '';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class PaymentModeService {
  constructor(private http: HttpClient) {}


  getPaymentModeListFromGenericApi(): Observable<any> {
    const get_url = baseApiUrl + 'commonList/generic/paymentMode';
    return this.http.get<any>(get_url,
      { headers: httpOptions.headers }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  getPaymentModeList(): Observable<any> {
    const get_url = baseApiUrl + 'commonList/paymentMode';
    return this.http.get<any>(get_url,
      { headers: httpOptions.headers }).pipe(
        map((res: any) => {
          return this.transformPaymentModeData(res);
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  transformPaymentModeData(data) {
    let formatedData = [];
    if (data && data.dataList) {
      data.dataList.forEach(function(item:any){
        let itemData:any = {};
        itemData.payment_mode_id = item.id;
        itemData.payment_mode_text = item.text;
        itemData.payment_mode_value = item.value;
        formatedData.push(itemData);
      });
      return {content:formatedData};
    } else {
      return {content:formatedData};
    }

  }
}
