import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class AuditReportService {
  constructor(private http: HttpClient) {}

  getAuditData(data) {
    return this.http.post(
      RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL + "/getAllRestApiAudits",
      data
    );
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL + url, data);
  }

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL + url);
  }
}
