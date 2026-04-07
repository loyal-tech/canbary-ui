import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class AuthResponseService {
  constructor(private http: HttpClient) {}
  baseUrl = RadiusConstants.ADOPT_RADIUS_BASE_URL;
  mvnoId = localStorage.getItem("mvnoId");

  getAuthResponseByUsername(userName) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findAuthResponseByUserName?mvnoId=${this.mvnoId}&username=` +
        encodeURIComponent(userName)
    );
  }

  findAllAuthResponseData(page, size, query = "") {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/authResponses?mvnoId=${this.mvnoId}&page=${page}&size=${size}${query}`
    );
  }

  deleteAuthResponseById(cdrId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.delete(
      `${this.baseUrl}/deleteAuthResponse?mvnoId=${this.mvnoId}&authresid=` + cdrId
    );
  }

  searchByUserName(page, size, userName) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findAuthResponseByUserName?mvnoId=${this.mvnoId}&page=${page}&size=${size}&username=${userName}`
    );
  }
}
