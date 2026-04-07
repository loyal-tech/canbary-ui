import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SearchPaymentService {

  constructor(private http: HttpClient) { }

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  downloadMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + url);
  }

  downloadPDF(type: any): any {
    const url = RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + `${type}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(map(
      (res: any) => {
        return new Blob([res], { type: 'application/pdf', });
      }))
  }
}
