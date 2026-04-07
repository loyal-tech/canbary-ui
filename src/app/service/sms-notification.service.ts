import { Injectable } from "@angular/core";
import { HttpClient, HttpBackend } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { NotificationBaseService } from "./notification-base.service";

@Injectable({
  providedIn: "root",
})
export class SmsNotificationService extends NotificationBaseService {
  private httpWithoutInterceptor: HttpClient;
  mvnoId = localStorage.getItem("mvnoId");
  baseUrl = RadiusConstants.ADOPT_COMMON_BASE_URL;
  constructor(http: HttpClient, private httpBackend: HttpBackend) {
    super(http);
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  getSmsDataBySourceName(mobileNo) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      "/findSmsBySourceName?mvnoId=" + this.mvnoId+"&mobileNo=" + mobileNo 
    );
  }

  findAllSmsData(itemsPerPage,currentPage) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get("/smss?mvnoId=" + this.mvnoId+"&size="+itemsPerPage+"&page="+currentPage);
  }

  deleteSmsById(smsId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.delete("/deleteSms?smsid=" + smsId + "&mvnoId=" + this.mvnoId);
  }

  addSmsDetails(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.post("/addSms?mvnoId=" + this.mvnoId, data);
  }

  updateSmsDetails(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.put("/updateSms?mvnoId=" + this.mvnoId, data);
  }

  sendSmsById(smsId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.post(
      "/sendSms?smsid=" + smsId + "&mvnoId=" + this.mvnoId,
      smsId
    );
  }
  getEvents() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get("/Event/all?mvnoId=" + this.mvnoId);
  }
  grtTemplate() {
    return this.httpWithoutInterceptor.get(`${this.baseUrl}/Templates/all`);
  }
}
