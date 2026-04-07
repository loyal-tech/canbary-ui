import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class VoucherConfigurationService {
  constructor(private http: HttpClient) {}
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  baseUrl = RadiusConstants.ADOPT_COMMON_BASE_URL + "/voucherManagement";

  getAllVouchers(page, size, mvnoId?) {
    const actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/all` + "?page=" + page + "&size=" + size + "&mvnoId=" + actualMvnoId
    );
  }

  getAllReseller() {
    return this.http.get(
      `${RadiusConstants.ADOPT_COMMON_BASE_URL}/Reseller/getAllResellers?mvnoId=${this.mvnoId}`
    );
  }

  changeVoucherConfigStatus(id, status, selectedMvnoId?) {
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId) {
    //   return this.http.get(
    //     `${this.baseUrl}/updateStatus?id=` +
    //       id +
    //       "&status=" +
    //       status +
    //       "&mvnoId=" +
    //       selectedMvnoId +
    //       "&lastModifiedBy=" +
    //       this.loggedInUser
    //   );
    // } else {
    const actualMvnoId = selectedMvnoId ?? localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/updateStatus?id=` +
        id +
        "&status=" +
        status +
        "&mvnoId=" +
        actualMvnoId +
        "&lastModifiedBy=" +
        this.loggedInUser
    );
    // }
  }

  searchVoucher(name, type, fromDate, toDate, page, size, mvnoId?) {
    const actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/all?name=` +
        encodeURIComponent(name.trim()) +
        "&voucherCodeFormat=" +
        type +
        "&mvnoId=" +
        actualMvnoId +
        "&fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
  }

  deleteById(id, mvnoId?) {
    const actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    return this.http.delete(`${this.baseUrl}/delete?configId=` + id + "&mvnoId=" + actualMvnoId);
  }

  viewVoucherConfigDetail(id, selectedMvnoId?) {
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId) {
    //   return this.http.get(`${this.baseUrl}/findById?configId=` + id + "&mvnoId=" + selectedMvnoId);
    // } else {
    const actualMvnoId = selectedMvnoId ?? localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/findById?configId=` + id + "&mvnoId=" + actualMvnoId);
    // }
  }

  saveVoucherConfig(voucherConfig, mvnoId?) {
    //return this.http.post(`${this.baseUrl}/addVoucherConfig`, voucherConfig);
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId) {
    //   return this.http.post(`${this.baseUrl}/addVoucherConfig`, voucherConfig);
    // } else {
    const actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    return this.http.post(`${this.baseUrl}/addVoucherConfig?mvnoId=` + actualMvnoId, voucherConfig);
    // }
  }

  updateVoucherConfig(voucherConfig, mvnoId?) {
    //return this.http.put(`${this.baseUrl}/update`, voucherConfig);
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId) {
    //   return this.http.put(`${this.baseUrl}/update`, voucherConfig);
    // } else {
    const actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    return this.http.put(`${this.baseUrl}/update?mvnoId=` + actualMvnoId, voucherConfig);
    // }
  }

  getAllPlans() {
    return this.http.get(
      `${RadiusConstants.ADOPT_COMMON_BASE_URL}/plan` + "?mvnoId=" + this.mvnoId
    );
  }

  getValidPlans(mvnoId?) {
    const actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    return this.http.get(
      `${RadiusConstants.ADOPT_COMMON_BASE_URL}/postpaidplan/all?planGroup=ALL&type=NORMAL&mvnoId=${actualMvnoId}`
    );
  }

  // generateVoucher(configId, batchName, selectedMvnoId) {
  //   let data = '';
  //   if (this.loggedInUser == 'superadmin') {
  //     return this.http.post(
  //       `${RadiusConstants.ADOPT_WIFI_BASE_URL}/voucher/generate?batchName=` +
  //         encodeURIComponent(batchName) +
  //         '&configId=' +
  //         configId +
  //         '&mvnoId=' +
  //         selectedMvnoId,
  //       data
  //     );
  //   } else {
  //     return this.http.post(
  //       `${RadiusConstants.ADOPT_WIFI_BASE_URL}/voucher/generate?batchName=` +
  //         encodeURIComponent(batchName) +
  //         '&configId=' +
  //         configId +
  //         '&mvnoId=' +
  //         this.mvnoId,
  //       data
  //     );
  //   }
  // }
  generateVoucherBatch(data) {
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId) {
    //   return this.http.post(`${RadiusConstants.ADOPT_COMMON_BASE_URL}/voucherbatch/generate`, data);
    // } else {
    return this.http.post(`${RadiusConstants.ADOPT_COMMON_BASE_URL}/voucherbatch/generate?mvnoId=`+localStorage.getItem("mvnoId"), data);
    // }
  }
}
