import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class LeadFollowupService {
  constructor(private http: HttpClient) {}

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_LEAD_BASE_URL + url);
  }

  getMethodCMS(url) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url, data, mvnoid, staffid) {
    return this.http.post(RadiusConstants.ADOPT_LEAD_BASE_URL + url, data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        mvnoid: mvnoid,
        staffid: staffid,
      }),
    });
  }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_LEAD_BASE_URL + url);
  }

  updateMethod(url, data, mvnoid, staffid) {
    return this.http.put(RadiusConstants.ADOPT_LEAD_BASE_URL + url, data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        mvnoid: mvnoid,
        staffid: staffid,
      }),
    });
  }
}
