import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NotificationBaseService } from "./notification-base.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class SmsConfigService extends NotificationBaseService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInuser = localStorage.getItem("loginUserName");
  constructor(http: HttpClient) {
    super(http);
  }

  findAll(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get("/smsConfigs?mvnoId=" + this.mvnoId + "&buId=" + data);
  }
  updateSmsConfig(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.put("/updateSmsConfig?mvnoId=" + this.mvnoId, data);
  }
  getSmsConfigMappings(emailConfigId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      "/findSmsConfigMappingBySmsConfigId?smsConfigId=" + emailConfigId + "&mvnoId=" + this.mvnoId
    );
  }
  deleteSmsConfigByAttributeId(smsConfigMappingId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.delete(
      `/deleteSmsConfigMapping?smsConfigMappingId=` + smsConfigMappingId + "&mvnoId=" + this.mvnoId
    );
  }
  updateSmsConfigMapping(data, selectedSmsConfigId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.put(
      "/updateSmsConfigMapping?mvnoId=" + this.mvnoId + "&smsConfigId=" + selectedSmsConfigId,
      data
    );
  }
  addSmsConfig(data, buid) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.post(
      "/addSmsConfig?mvnoId=" +
        this.mvnoId +
        "&smsUrl=" +
        data.smsUrl +
        "&configStatus=" +
        data.configStatus +
        "&buId=" +
        buid +
        "&createdBy=" +
        this.loggedInuser,
      data
    );
  }
  addSmsConfigMapping(data, selectedSmsConfigId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // data = data.map(val =>{
    //   val.smsConfigId = selectedSmsConfigId
    // });
    data.forEach(item => {
      item.smsConfigId = selectedSmsConfigId;
    });
    return this.post("/addSmsConfigMapping?mvnoId=" + this.mvnoId, data);
  }
  getMethodAPIGateway(url) {
    return this.getapigateway(url);
  }
}
