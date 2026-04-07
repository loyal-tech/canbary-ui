import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { HttpResponseCache } from "./http-response-cache";

@Injectable({
  providedIn: "root"
})
export class QosPolicyService {
  constructor(
    private http: HttpClient,
    private cache: HttpResponseCache
  ) {}

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

  getMethodWithCache(url) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, {
      params: { from_cache: "true" } // Return the cached response if available.
    });
  }

  clearCache(url) {
    if (
      this.cache.hasStored(
        RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url + "?from_cache=true"
      )
    ) {
      this.cache.remove(
        RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url + "?from_cache=true"
      );
    }
  }

  getMethodWithCacheFromSales(url) {
    return this.http.get(RadiusConstants.ADOPT_LEAD_BASE_URL + url, {
      params: { from_cache: "true" } // Return the cached response if available.
    });
  }
}
