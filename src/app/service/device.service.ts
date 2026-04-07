import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RadiusBaseServiceService } from "./radius-base-service.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
@Injectable({
  providedIn: "root"
})
export class DeviceService extends RadiusBaseServiceService {
  constructor(http: HttpClient) {
    super(http);
  }

  basePath: string = "/Device";
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  getAll(page, size, deviceProfileName) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `${this.basePath}/all?mvnoId=${this.mvnoId}&page=${page}&size=${size}&name=${deviceProfileName}`
    );
  }

  getByName(devieProfileName: string) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `${this.basePath}/findByName?deviceProfileName=` +
        encodeURIComponent(devieProfileName) +
        "&mvnoId=" +
        `${this.mvnoId}`
    );
  }

  getById(deviceId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `${this.basePath}/findById?deviceId=` + deviceId + "&mvnoId=" + `${this.mvnoId}`
    );
  }

  add(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.post(`${this.basePath}/save?mvnoId=${data.mvnoName}`, data);
    // else
    return this.post(`${this.basePath}/save?mvnoId=${this.mvnoId}`, data);
  }

  update(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.put(`${this.basePath}/update?mvnoId=${data.mvnoName}`, data);
    // else
    return this.put(`${this.basePath}/update?mvnoId=${this.mvnoId}`, data);
  }

  deleteByName(deviceProfileName, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.delete(
    //     `${this.basePath}/delete?deviceProfileName=` +
    //       deviceProfileName +
    //       "&mvnoId=" +
    //       `${selectedMvnoId}`
    //   );
    // else
    return this.delete(
      `${this.basePath}/delete?deviceProfileName=` +
        deviceProfileName +
        "&mvnoId=" +
        `${this.mvnoId}`
    );
  }

  changeStatus(deviceProfileName, status, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.get(
    //     `${this.basePath}/changeStatus?deviceProfileName=` +
    //       deviceProfileName +
    //       "&mvnoId=" +
    //       `${selectedMvnoId}` +
    //       "&status=" +
    //       status
    //   );
    // else
    return this.get(
      `${this.basePath}/changeStatus?deviceProfileName=` +
        deviceProfileName +
        "&mvnoId=" +
        `${this.mvnoId}` +
        "&status=" +
        status
    );
  }

  getCoaProfiles() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/coaProfiles?mvnoId=${this.mvnoId}`);
  }
}
