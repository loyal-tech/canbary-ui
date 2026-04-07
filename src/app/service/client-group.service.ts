import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RadiusBaseServiceService } from "./radius-base-service.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class ClientGroupService extends RadiusBaseServiceService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(http: HttpClient) {
    super(http);
  }

  getClientGroupDataByName(groupName) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `/findClientGroupByName?mvnoId=${this.mvnoId}&name=` + encodeURIComponent(groupName)
    );
  }

  getClientGroupDataById(groupId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/findClientGroupById?mvnoId=${this.mvnoId}&clientGroupId=` + groupId);
  }

  findAllClientGroupData(page, size, name) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `/findClientGroupByName?mvnoId=${this.mvnoId}&name=${name}&page=${page}&size=${size}`
    );
  }

  findAllClientData(page, size, clientIpAddress) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `/clients?mvnoId=${this.mvnoId}&page=${page}&size=${size}&clientIpAddress=${clientIpAddress}`
    );
  }

  deleteClientGroupById(groupId, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.delete(`/deleteClientGroup?mvnoId=${selectedMvnoId}&clientGroupId=` + groupId);
    // else
    return this.delete(`/deleteClientGroup?mvnoId=${this.mvnoId}&clientGroupId=` + groupId);
  }

  addNewClientGroup(data, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId) return this.post(`/addClientGroup?mvnoId=${selectedMvnoId}`, data);
    // else
    return this.post(`/addClientGroup?mvnoId=${this.mvnoId}`, data);
  }

  updateClientGroup(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId) return this.put(`/updateClientGroup?mvnoId=${data.mvnoId}`, data);
    // else
    return this.put(`/updateClientGroup?mvnoId=${this.mvnoId}`, data);
  }

  changeClientGroupSatus(groupId, status, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.get(
    //     `/updateClientGroupStatus?mvnoId=${selectedMvnoId}&clientGroupId=` +
    //       groupId +
    //       "&status=" +
    //       status
    //   );
    // else
    return this.get(
      `/updateClientGroupStatus?mvnoId=${this.mvnoId}&clientGroupId=` +
        groupId +
        "&status=" +
        status
    );
  }

  deleteClientReplyById(attributeId, selectedMvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // let userId = localStorage.getItem("userId");
    // let superAdminId = RadiusConstants.SUPERADMINID;
    // if (userId == superAdminId)
    //   return this.delete(
    //     `/deleteCustomerReply?mvnoId=${selectedMvnoId}&attributeId=` + attributeId
    //   );
    // else
    return this.delete(`/deleteCustomerReply?mvnoId=${this.mvnoId}&attributeId=` + attributeId);
  }

  getClientAttributes(groupId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/clientReplyByClientGroupId?clientGroupId=${groupId}&mvnoId=${this.mvnoId}`);
  }
  validGroups(mvnoId) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/coaDMProfiles?mvnoId=${this.mvnoId}`);
  }

  reloadCache() {
    return this.get(`/reloadCache`);
  }
}
