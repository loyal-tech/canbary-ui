import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ADOPT_PRODUCT_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class OtpService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  basePath: string = "/otpmanagment";

  baseUrl = ADOPT_PRODUCT_MANAGEMENT_BASE_URL;

  constructor(private http: HttpClient) {}

  getAll() {
    let mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl + this.basePath}/getAll?mvnoId=${mvnoId}`);
  }

  getByName(profileName: string) {
    return this.http.get(
      `${this.baseUrl + this.basePath}/profile/` + encodeURIComponent(profileName) + `?mvnoId=${localStorage.getItem("mvnoId")}`
    );
  }

  getById(otpId) {
    return this.http.get(`${this.baseUrl + this.basePath}/` + otpId + `?mvnoId=${this.mvnoId}`);
  }

  deleteById(profileId) {
    return this.http.delete(`${this.baseUrl + this.basePath}/${profileId}?mvnoId=${this.mvnoId}`);
  }

  add(data) {
    let mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(`${this.baseUrl + this.basePath}?mvnoId=${mvnoId}`, data);
  }

  update(profileId, data) {
    return this.http.put(
      `${this.baseUrl + this.basePath}/${profileId}?mvnoId=${this.mvnoId}`,
      data
    );
  }
}
