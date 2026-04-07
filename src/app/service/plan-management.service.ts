import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class PlanManagementService {

  constructor(private http: HttpClient) { }


  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  // createMethod(url, data) {
  //   return this.http.post("http://143.110.248.5:20080/api/v1" + url, data);
  // }

  // getDataMethod(url) {
  //   return this.http.get("http://143.110.248.5:20080/api/v1" + url);
  // }

  // deletePlanMethod(url) {
  //   return this.http.delete("http://143.110.248.5:20080/api/v1" + url);
  // }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  updatePlanMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
}
