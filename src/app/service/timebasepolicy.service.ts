import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { TimeBasePolicy } from "../components/model/time-base-policy";

@Injectable({
  providedIn: "root"
})
export class TimebasepolicyService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  baseUrl = RadiusConstants.ADOPT_COMMON_BASE_URL.concat("/timebasepolicy");

  constructor(private http: HttpClient) {}
  searchbasepolicy(page, pagesize, data) {
    let mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(
      `${this.baseUrl}/search?page=` +
        page +
        "&pageSize=" +
        pagesize +
        "&sortBy=createdate&sortOrder=0&mvnoId=" +
        mvnoId,
      data
    );
  }

  getAlltimebasepolicy(data) {
    // return this.http.post(`${this.baseUrl}`,data);

    return this.http.get(`${this.baseUrl}/all?mvnoId=${localStorage.getItem("mvnoId")}`);
  }

  getAlltimebasepolicywithpagination(data) {
    // return this.http.post(`${this.baseUrl}`,data);

    return this.http.post(`${this.baseUrl}?mvnoId=${localStorage.getItem("mvnoId")}`, data);
  }

  getPolicyById(policyId) {
    return this.http.get(
      `${this.baseUrl}/` + policyId + `?mvnoId=${localStorage.getItem("mvnoId")}`
    );
  }

  addNewPolicyDetails(policyData, mvnoId) {
    return this.http.post(`${this.baseUrl}/save?mvnoId=${mvnoId}`, policyData);
  }

  updatePolicyDetails(policyData, mvnoId) {
    return this.http.post(`${this.baseUrl}/update?mvnoId=${mvnoId}`, policyData);
  }

  deletePolicy(data) {
    return this.http.post(`${this.baseUrl}/delete`, data);
  }

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }
}
