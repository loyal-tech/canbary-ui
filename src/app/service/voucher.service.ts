import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class VoucherService {
  constructor(private http: HttpClient) {}

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  baseUrl = RadiusConstants.ADOPT_COMMON_BASE_URL;

  getAllVoucherConfgiuration() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/voucher-management/all` + "?mvnoId=" + this.mvnoId);
  }

  getAllVouchers(page, size) {
    return this.http.get(
      `${this.baseUrl}/voucher/all` +
        "?page=" +
        page +
        "&size=" +
        size +
        "&mvnoId=" +
        localStorage.getItem("mvnoId")
    );
  }

  findVouchers(batchName, status) {
    let mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/voucher/findVouchers?batchName=` +
        encodeURIComponent(batchName.trim()) +
        "&status=" +
        status +
        "&mvnoId=" +
        mvnoId
      // '&size=' +
      // size +
      // '&fromDate=' +
      // fromDate +
      // '&toDate=' +
      // toDate
    );
  }

  addVoucherId(id) {
    return this.http.get(`${this.baseUrl}/voucher/addVoucherId?id=` + id);
  }

  changeStatusToActive(totalvoucherIdList) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    return this.http.get(
      `${this.baseUrl}/voucher/changeStatusToActive?voucherIdList=` +
        totalvoucherIdList +
        "&mvnoId=" +
        this.mvnoId +
        "&lastModifiedBy=" +
        this.loggedInUser
    );
  }

  changeStatusToBlock(totalvoucherIdList) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    return this.http.get(
      `${this.baseUrl}/voucher/changeStatusToBlock?voucherIdList=` +
        totalvoucherIdList +
        "&mvnoId=" +
        this.mvnoId +
        "&lastModifiedBy=" +
        this.loggedInUser
    );
  }
  changeStatusToUnblock(totalvoucherIdList) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    return this.http.get(
      `${this.baseUrl}/voucher/changeStatusToUnblock?voucherIdList=` +
        totalvoucherIdList +
        "&mvnoId=" +
        this.mvnoId +
        "&lastModifiedBy=" +
        this.loggedInUser
    );
  }
  changeStatusToScrap(totalvoucherIdList) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    return this.http.get(
      `${this.baseUrl}/voucher/changeStatusToScrap?voucherIdList=` +
        totalvoucherIdList +
        "&mvnoId=" +
        this.mvnoId +
        "&lastModifiedBy=" +
        this.loggedInUser
    );
  }
  sendSms(countryCode, mobileNo, voucherIdSms, voucherCodeSms) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(
      `${this.baseUrl}/voucher/sendSms?id=` +
        voucherIdSms +
        "&mobileNo=" +
        mobileNo +
        "&countryCode=" +
        countryCode +
        "&mvnoId=" +
        this.mvnoId +
        "&code=" +
        encodeURIComponent(voucherCodeSms),
      voucherIdSms
    );
  }
  findByBatchId(batchId: any, page, size) {
    return this.http.get(
      `${this.baseUrl}/voucher/findVouchersByBatchId?batchId=${batchId}&page=${page}&size=${size}&mvnoId=${localStorage.getItem("mvnoId")}`
    );
  }
  getDataTOExport(batchName, status) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/voucher/exportToCSV?batchName=` +
        encodeURIComponent(batchName) +
        "&status=" +
        status +
        "&mvnoId=" +
        this.mvnoId
    );
  }
}
