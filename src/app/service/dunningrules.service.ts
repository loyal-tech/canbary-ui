import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class DunningrulesService {
  baseUrl = RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL;

  constructor(private http: HttpClient) {}

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

  getDunningRuleList(data) {
    return this.http.post(
      `${this.baseUrl}/dunningrule/list?mvnoId=${localStorage.getItem("mvnoId")}`,
      data
    );
  }

  searchDunningRule(data) {
    return this.http.post(
      `${this.baseUrl}/dunningrule/search?mvnoId=${localStorage.getItem("mvnoId")}`,
      data
    );
  }
}
