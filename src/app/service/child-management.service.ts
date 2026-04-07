import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Observable } from "rxjs";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class ChildManagementService {
  constructor(private http: HttpClient) {}

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_COMMON_BASE_URL + url, data);
  }

  getAllChild(url, data) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url, data);
  }
  putMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_COMMON_BASE_URL + url, data);
  }
  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_COMMON_BASE_URL + url, data);
  }

  getMethodWithCache(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url, {
      params: { from_cache: "true" } // Return the cached response if available.
    });
  }

  //   clearCache(url) {
  //     if (this.cache.hasStored(RadiusConstants.ADOPT_COMMON_BASE_URL + url + "?from_cache=true")) {
  //       console.log("Found Cached data >>>>>>>>>>>>>>>>> ");
  //       this.cache.remove(RadiusConstants.ADOPT_COMMON_BASE_URL + url + "?from_cache=true");
  //     }
  //   }

 
}
