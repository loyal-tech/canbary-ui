import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { ADOPT_COMMON_BASE_URL } from 'src/app/RadiusUtils/RadiusConstants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

const BASE_API_URL = ADOPT_COMMON_BASE_URL+'/';

@Injectable({
  providedIn: 'root'
})
export class ChangePlanService {
  constructor(private http: HttpClient) {

  }
  getTaxByAmount(obj){
    const post_url = BASE_API_URL + 'taxCalculation/ByAmount';
    return this.http.post<any>(post_url,obj)
  }

  getPlanPurchaseType(): Observable<any> {
    const get_url = BASE_API_URL + 'commonList/generic/planPurchaseType';
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getSubscriberCurrentPlan(custId: any): Observable<any> {
    const get_url = BASE_API_URL + 'subscriber/getSubscriberCurrentPlan/' + custId;
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
  checkeligibility(custId){
    const get_url = BASE_API_URL + 'subscriber/checkEligibilityAddon/'+ custId
    return this.http.get<any>(get_url, { headers: httpOptions.headers });
  }

  changePlan(change_plan_data: any): Observable<any> {
    const update_url = BASE_API_URL + 'subscriber/changePlan';
    return this.http.post<any>(update_url, change_plan_data, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
  getPurchaseAddonePlanService(data: any): Observable<any> {
    const post_url = BASE_API_URL + 'plan/Bypartner';
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
  getAmountService(data: any): Observable<any> {
    const post_url = BASE_API_URL + 'getTaxDetails/byPlan';
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  
  getSubscriberBasicDetails(subscriber_id): Observable<any> {
    const get_url = BASE_API_URL + 'subscriber/getBasicCustDetails/'+subscriber_id;
    return this.http.get<any>(get_url,{ headers: httpOptions.headers}).pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }
}
