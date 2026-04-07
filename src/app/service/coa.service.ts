import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CoaService {
  baseUrl = RadiusConstants.ADOPT_RADIUS_BASE_URL;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  constructor(private http: HttpClient) {}
  getCoAByName(name) {
    return this.http.get(
      `${this.baseUrl}/findCoaDMProfileByName?coaDMProfileName=` + encodeURIComponent(name)
    );
  }

  getCoAByType(type) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/coaDMProfilesByType?mvnoId=${this.mvnoId}&coaDMProfileType=` + type
    );
  }

  getCoAById(coAId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findCoaDMProfileById?mvnoId=${this.mvnoId}&coaDMProfileId=` + coAId
    );
  }

  searchProfiles(profileName, profileType) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/searchCoaDMProfile?mvnoId=${this.mvnoId}&coaDMProfileName=${profileName}&coaDMProfileType=` +
        profileType
    );
  }

  findAllCoA(page, size, name, type) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/coaDMProfiles?mvnoId=${this.mvnoId}&page=${page}&size=${size}&name=${name}&type=${type}`
    );
  }

  addNewCoA(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.post(`${this.baseUrl}/addCoaDMProfile?mvnoId=${data.mvnoName}`, data);
    // else
    return this.http.post(`${this.baseUrl}/addCoaDMProfile?mvnoId=${this.mvnoId}`, data);
  }

  updateCoA(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.put(`${this.baseUrl}/updateCoaDMProfile?mvnoId=${data.mvnoName}`, data);
    // else
    return this.http.put(`${this.baseUrl}/updateCoaDMProfile?mvnoId=${this.mvnoId}`, data);
  }

  deleteCoAById(coAId, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.delete(
    //     `${this.baseUrl}/deleteCoaDMProfile?mvnoId=${selectedMvnoId}&coaDMProfileId=` + coAId
    //   );
    // else
    return this.http.delete(
      `${this.baseUrl}/deleteCoaDMProfile?mvnoId=${this.mvnoId}&coaDMProfileId=` + coAId
    );
  }

  deleteCoAAttributeByAttributeId(coAAttributeId, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.delete(
    //     `${this.baseUrl}/deleteCoaDMProfileAttribute?mvnoId=${selectedMvnoId}&coaDMProfileAttributeId=` +
    //       coAAttributeId
    //   );
    // else
    return this.http.delete(
      `${this.baseUrl}/deleteCoaDMProfileAttribute?mvnoId=${this.mvnoId}&coaDMProfileAttributeId=` +
        coAAttributeId
    );
  }

  getCoAAttributeById(coAId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findCoaDMProfileAttByCoaDMProfileId?mvnoId=${this.mvnoId}&coaDMProfileId=` +
        coAId
    );
  }

  updateCoAAttribute(data, selectedMvnoId, coaDMId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.put(
    //     `${this.baseUrl}/updateCoaDMProfileAttribute?mvnoId=${selectedMvnoId}&coaDMId=${coaDMId}`,
    //     data
    //   );
    // else
    return this.http.put(
      `${this.baseUrl}/updateCoaDMProfileAttribute?mvnoId=${this.mvnoId}&coaDMId=${coaDMId}`,
      data
    );
  }
}
