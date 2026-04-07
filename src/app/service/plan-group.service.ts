import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class PlanGroupService {
  baseUrl = RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL;

  constructor(private http: HttpClient) {}
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

  getPlanGroupList(data) {
    return this.http.post(
      `${this.baseUrl}/planGroupMappings/list` + "?mvnoId=" + localStorage.getItem("mvnoId"),
      data
    );
  }

  searchPlanGroup(data) {
    return this.http.post(
      `${this.baseUrl}/planGroupMappings/search` + "?mvnoId=" + localStorage.getItem("mvnoId"),
      data
    );
  }

  getPlansByTypeServiceModeStatusAndServiceArea(
    url,
    type,
    serviceId,
    serviceAreaId,
    mode,
    status,
    planGroup,
    validty,
    unitV
  ) {
    if (status == null) status = "ACTIVE";
    return this.http.get(
      `${RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL}${url}?serviceId=${serviceId}${serviceAreaId}&mvnoId=${localStorage.getItem("mvnoId")}&type=${type}&mode=${mode}&status=${status}&planGroup=${planGroup}&unitsOfValidity=${unitV}&validity=${validty}`
    );
  }
}
