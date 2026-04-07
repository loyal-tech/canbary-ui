import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class PasswordPolicyService {
  baseUrl = RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + "/passwordPolicy";
  baseUrlNotification = RadiusConstants.ADOPT_NOTIFICATION_BASE_URL;
  constructor(private http: HttpClient) {}

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + url);
  }

  getAllPasswordPolicy() {
    return this.http.get(`${this.baseUrl}/all`);
  }

  findPasswordPolicyById(id) {
    return this.http.get(`${this.baseUrl}/get/` + id);
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + url, data);
  }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + url);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + url, data);
  }
  searchPassword(page, filter) {
    return this.http.post(
      `${this.baseUrl}/search?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id`,
      filter
    );
  }

  getAllEvent() {
    return this.http.get(`${this.baseUrlNotification}/event_temp_bind/all`, {});
  }
}
