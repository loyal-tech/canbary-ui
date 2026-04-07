import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
@Injectable({
  providedIn: "root"
})
export class LocationService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(private http: HttpClient) {}
  baseUrl = RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + "/LocationMaster";
  commonUrl = RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT;
  getAllLocation(page, size, name) {
    return this.http.get(
      this.baseUrl + `/getAllLocationMaster?` + "page=" + page + "&size=" + size + `&name=${name}`
    );
  }

  getAllActiveLocation() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(this.baseUrl + `/activeLocation`);
  }

  getAllMacByLocation(url) {
    return this.http.get(this.baseUrl + `/getMacFromLocations?` + url);
  }

  getLocationByName(name) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(this.baseUrl + `/findLocation?name=` + encodeURIComponent(name));
  }

  getLocationById(id) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(this.baseUrl + `/findLocationMasterById?locationMasterId=${id}`);
  }

  deleteLocation(id, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.delete(this.baseUrl + `/deleteLocation?locationMasterId=${id}`);
    // else
    return this.http.delete(this.baseUrl + `/deleteLocation?locationMasterId=${id}`);
  }

  addNewLocation(data) {
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId) {
    //   return this.http.post(this.baseUrl + `/addLocationMaster`, data);
    // } else {
    return this.http.post(this.baseUrl + `/addLocationMaster`, data);
    // }
  }

  updateLocation(data) {
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.put(this.baseUrl + `/updateLocation?mvnoId=${data.mvnoName}`, data);
    // else
    return this.http.put(this.baseUrl + `/updateLocation`, data);
  }

  changeLocationSatus(name, status, selectedMvnoId) {
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.http.get(this.baseUrl + `/updateLocationStatus?name=${name}&status=${status}`);
    // else
    return this.http.get(this.baseUrl + `/updateLocationStatus?name=${name}&status=${status}`);
  }

  getMvnoNameAndIds(url) {
    return this.http.get(this.commonUrl + url);
  }
}
