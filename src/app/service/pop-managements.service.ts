import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ADOPT_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import { HttpResponseCache } from "./http-response-cache";
@Injectable({
  providedIn: "root"
})
export class PopManagementsService {
  baseUrl = ADOPT_INVENTORY_MANAGEMENT_BASE_URL + "/popmanagement";

  constructor(
    private http: HttpClient,
    private cache: HttpResponseCache
  ) {}
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
  getInventoryMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
  searchPop(page, filterData) {
    return this.http.post(
      this.baseUrl +
        "/search?page=" +
        page.page +
        "&pageSize=" +
        page.pageSize +
        "&sortBy=id&sortOrder=0",
      filterData
    );
  }
  getMethodWithCache(url) {
    return this.http.get(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, {
      params: { from_cache: "true" } // Return the cached response if available.
    });
  }
  clearCache(url) {
    if (
      this.cache.hasStored(
        RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url + "?from_cache=true"
      )
    ) {
      this.cache.remove(
        RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url + "?from_cache=true"
      );
    }
  }
}
