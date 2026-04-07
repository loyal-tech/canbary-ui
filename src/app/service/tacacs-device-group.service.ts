import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class TacacsDeviceGroupService {
  constructor(private http: HttpClient) {}

  getMethod(url, data) {
    return this.http.get(RadiusConstants.ADOPT_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url, data);
  }
  getCustomer(url) {
    return this.http.get(RadiusConstants.ADOPT_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url);
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url, data);
  }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url, data);
  }

  postMethodDeamon(url, data) {
    return this.http.post(RadiusConstants.ADOPT_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url, data);
  }

  searchTax(url , data) {
    return this.http.post(RadiusConstants.ADOPT_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url, data);
  }
}
