import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

const BASE_API_URL = '';

@Injectable({
  providedIn: 'root'
})
export class RecordPaymentService {
  constructor(private http: HttpClient) {

  }

  transformTdsPendingPayments(result) {
    if (result && result.dataList && result.dataList.length) {
      result.dataList.forEach(element => {
        element.display_text = element.amount+" ,"+element.paymentdate+" ,"+element.referenceno;
      });
      return result;  
    } else {
      return result;
    }
  }

  getTdsPendingPayments(custId:any): Observable<any> {
    const get_url = BASE_API_URL + 'subscriber/getTdsPendingPayments/'+custId;
    return this.http.get<any>(get_url,{ headers: httpOptions.headers}).pipe(
        map((res: any) => {
          return this.transformTdsPendingPayments(res);
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }


  updateRecordPayment(network_data:any): Observable<any> {
    const get_url = BASE_API_URL + 'subscriber/recordPayment';
    return this.http.post<any>(get_url,network_data,{ headers: httpOptions.headers}).pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }



}
