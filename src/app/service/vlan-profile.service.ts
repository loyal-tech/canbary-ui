import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class VlanProfileService {
  baseUrl = RadiusConstants.ADOPT_RADIUS_BASE_URL;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loginUserName");

  constructor(private http: HttpClient) {}

  findAllVLANProfile(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(`${this.baseUrl}/vlans/list?mvnoId=${this.mvnoId}`, data);
  }

  deleteVLANProfileById(vlanId, selectedMvnoId, userId, loggedInUser) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loginUserName");
    return this.http.delete(
      `${this.baseUrl}/deleteVlan?mvnoId=${this.mvnoId}&vlanId=` +
        vlanId +
        "&staffId=" +
        userId +
        "&loggedInUser=" +
        loggedInUser
    );
  }

  addNewVLANProfile(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loginUserName");
    return this.http.post(`${this.baseUrl}/addVlan?mvnoId=${this.mvnoId}`, data);
  }

  updateVLANProfile(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loginUserName");
    return this.http.put(`${this.baseUrl}/updateVlan?mvnoId=${this.mvnoId}`, data);
  }

  deleteVLANProfile(selectedMvnoIds) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loginUserName");
    let userId = localStorage.getItem("userId");
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      body: selectedMvnoIds
    };
    return this.http.delete(
      `${this.baseUrl}/deleteMultipleVlan?mvnoId=${this.mvnoId}&staffId=${userId}&loggedInUser=${this.loggedInUser}`,
      options
    );
  }

  getProfileById(vlanProfileId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findVlanById?mvnoId=${this.mvnoId}&vlanId=` + vlanProfileId
    );
  }

  search(request, page, size) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(
      `${this.baseUrl}/vlans/search?mvnoId=${this.mvnoId}&size=${size}&page=${page}`,
      request
    );
  }

  getVlanColoumns() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/api/columns?entityName=VLANManagement`);
  }

  addBulkVLANProfile(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loginUserName");
    let userId = localStorage.getItem("userId");
    return this.http.post(
      `${this.baseUrl}/addBulkVlan?mvnoId=${this.mvnoId}&staffId=${userId}&loggedInUser=${this.loggedInUser}`,
      data
    );
  }

  updateBulkVLANProfile(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loginUserName");
    let userId = localStorage.getItem("userId");
    return this.http.post(
      `${this.baseUrl}/updateBulkVlan?mvnoId=${this.mvnoId}&staffId=${userId}&loggedInUser=${this.loggedInUser}`,
      data
    );
  }

  downloadVlanFile(filename) {
    this.mvnoId = localStorage.getItem("mvnoId");

    const fileExtension = filename.split(".").pop();
    let fileType = "";

    if (fileExtension === "csv") {
      fileType = "text/csv";
    } else if (fileExtension === "xlsx") {
      fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    return this.http
      .get(`${this.baseUrl}/vlan/download?filename=${filename}&mvnoId=${this.mvnoId}`, {
        responseType: "blob"
      })
      .pipe(
        map((res: any) => {
          return new Blob([res], { type: fileType });
        })
      );
  }

  downloadVlanAuditFile(filename) {
    this.mvnoId = localStorage.getItem("mvnoId");

    const fileExtension = filename.split(".").pop();
    let fileType = "";

    if (fileExtension === "csv") {
      fileType = "text/csv";
    } else if (fileExtension === "xlsx") {
      fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    return this.http
      .get(`${this.baseUrl}/vlan/audit/download?filename=${filename}&mvnoId=${this.mvnoId}`, {
        responseType: "blob"
      })
      .pipe(
        map((res: any) => {
          return new Blob([res], { type: fileType });
        })
      );
  }

  findVLANAudit(data, vlanId) {
    return this.http.post(`${this.baseUrl}/vlanAudit/getByVlanId?vlanId=${vlanId}`, data);
  }
  findAllVLANAudit(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // console.log(`${this.baseUrl}/vlanAudit/getByVlanId?vlanId=${vlanId}`);
    return this.http.post(`${this.baseUrl}/vlanAudit/list?mvnoId=${this.mvnoId}`, data);
  }
  filterAudit(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // console.log(`${this.baseUrl}/vlanAudit/getByVlanId?vlanId=${vlanId}`);
    return this.http.post(`${this.baseUrl}/vlanAudit/filter?mvnoId=${this.mvnoId}`, data);
  }

  getAllVlanData() {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loginUserName");
    let userId = localStorage.getItem("userId");
    return this.http.get(`${this.baseUrl}/exportVlan?mvnoId=${this.mvnoId}`);
  }
}
