import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ADOPT_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class ProuctManagementService {
  baseUrl = ADOPT_INVENTORY_MANAGEMENT_BASE_URL + "/product";

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  constructor(private http: HttpClient) {}

  getAll(plandata) {
    return this.http.post(this.baseUrl, plandata);
  }
  save(data) {
    return this.http.post(this.baseUrl + "/save", data);
  }
  update(data) {
    return this.http.post(this.baseUrl + "/update", data);
  }
  delete(data) {
    return this.http.post(this.baseUrl + "/delete", data);
  }

  searchProduct(page, filter) {
    // return this.http.post(`${this.baseUrl}/searchProduct`, pageDto);
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
  getAllActiveProduct() {
    return this.http.get(this.baseUrl + "/getAllActiveProduct");
  }
  // getAllProductByProductCategory() {
  //   return this.http.get(this.baseUrl + "/getAllProductByServiceId");
  // }

  getAllNBAndNAProducts() {
    return this.http.get(this.baseUrl + "/getAllNetworkandNaBindProduct");
  }

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
}
