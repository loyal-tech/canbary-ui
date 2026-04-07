import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ADOPT_PRODUCT_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "../RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class CustomerInventoryMappingService {
  baseUrl = RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL;

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  constructor(private http: HttpClient) {}

  deleteMacForCustomer(mapping) {
    return this.http.post(
      `${this.baseUrl}/inoutWardMacMapping/save?mvnoId=${this.mvnoId}`,
      mapping
    );
  }
  getByCustomerId(data) {
    return this.http.post(`${this.baseUrl}/inwards/getByCustomerId`, data);
  }
  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url);
  }
  postMethod(url, data: any) {
    return this.http.post(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
  getByPopCustomerId(data) {
    return this.http.post(`${this.baseUrl}/inwards/getAllInventoriesByOwner`, data);
  }
  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
}
