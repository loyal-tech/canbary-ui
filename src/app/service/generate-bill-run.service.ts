import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenerateBillRunService {

  constructor(private http: HttpClient) { }

  searchMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + url);
  }

   generateExport(url) {
    return this.http.get(RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + url);
  }

   get(path) {
    return this.http.get(RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + path);
  }

   postMethod(url, data) {
        return this.http.post(RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + url, data);
    }

}
