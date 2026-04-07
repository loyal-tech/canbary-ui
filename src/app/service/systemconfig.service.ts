import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class SystemconfigService {
  constructor(private http: HttpClient) {}

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + url);
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

  searchTax(url, data) {
    return this.http.post(RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + url, data);
  }

  getConfigurationByName(name, mvnoId?) {
    let actualMvnoId = mvnoId ? mvnoId : localStorage.getItem("mvnoId");
    let endPoint = `/system/configuration/getConfigurationByName?name=${name}&mvnoId=${actualMvnoId}`;
    return this.http.get(RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + endPoint);
  }
}
