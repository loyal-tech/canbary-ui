import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { type } from "os";
import { ADOPT_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class ExternalItemManagementService {
  baseUrl = ADOPT_INVENTORY_MANAGEMENT_BASE_URL;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(private http: HttpClient) {}
  getAll(plandata) {
    return this.http.post(this.baseUrl + "/externalitemmanagement", plandata);
  }
  save(data) {
    return this.http.post(this.baseUrl + "/externalitemmanagement/save", data);
  }
  update(data) {
    return this.http.post(this.baseUrl + "/externalitemmanagement/update", data);
  }
  delete(id) {
    return this.http.delete(this.baseUrl + `/externalitemmanagement/delete/${id}`);
  }

  getAllProducts() {
    return this.http.get(this.baseUrl + "/product/getAllCBProducts");
  }

  getAllWareHouse() {
    return this.http.get(this.baseUrl + "/warehouseManagement/getAllActiveWarehouse");
  }

  getExternalItemMacMapping(externalItemId) {
    return this.http.get(
      `${this.baseUrl}/externalitemmacserialmapping/getExternalItemGroupMacSerialMapping?externalItemId=${externalItemId}`
    );
  }

  saveExternalItemMACMapping(list) {
    return this.http.post(`${this.baseUrl}/externalitemmacserialmapping/save`, list);
  }
  deleteMacMapping(itemId) {
    return this.http.get(
      `${this.baseUrl}/externalitemmacserialmapping/deleteExternalItemMac?itemId=` + itemId
    );
  }

  search(page, filter) {
    return this.http.post(
      `${this.baseUrl}/externalitemmanagement/search?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id`,
      filter
    );
  }

  postMethod(url, data) {
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  assignToCustomer(customerInventoryMapping) {
    return this.http.post(this.baseUrl + "/inwards/assignToCustomer", customerInventoryMapping);
  }
  getAllMACMappingByExternalItemId(externalItemId) {
    return this.http.get(
      `${this.baseUrl}/externalitemmanagement/getAllMACMappingByExternalItemId?externalItemId=` +
        externalItemId
    );
  }
  updateMACMappingList(list) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/updateMACMappingList`, list);
  }
  getById(externalItemId) {
    return this.http.get(`${this.baseUrl}/inwards/` + externalItemId);
  }
  getAllAssignInventories(staffId, plandata) {
    return this.http.post(
      `${this.baseUrl}/inwards/getAllAssignInventories?staffId=` + staffId,
      plandata
    );
  }
  getAllAssignInventoryMappingByStaffId(ownerId, type, data) {
    return this.http.post(
      `${this.baseUrl}/item/getAllItemsByOwner?ownerId=` + ownerId + "&ownerType=" + type,
      data
    );
  }
  getsearchAssignInventories(data, ownerId, type) {
    // return this.http.post(`${this.baseUrl}/inwards/getAllInventoriesByOwner?ownerId=1&ownerType=Partner`
    // + page.page + `&pageSize=` + page.pageSize + `&sortOrder=` + 0 + `&sortBy=id` + `&ownerId=` + ownerId, filter)

    return this.http.post(
      `${this.baseUrl}/item/getAllItemsByOwner?ownerId=` + ownerId + "&ownerType=" + type,
      data
    );
  }

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url);
  }
  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
}
