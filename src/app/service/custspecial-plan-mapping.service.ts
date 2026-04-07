import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class CustspecialPlanMappingService {
  baseUrl = RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL;
  loggedInUser = localStorage.getItem("loggedInUser");
  customerAllList: any = [];
  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {}

  postMethod(url, data) {
    return this.http.post(
      RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url,
      data
    );
  }

  getMethod(url) {
    return this.http.get(
      RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url
    );
  }

  deleteMethod(url) {
    return this.http.delete(
      RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url
    );
  }

  updateMethod(url, data) {
    return this.http.put(
      RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url,
      data
    );
  }
}
