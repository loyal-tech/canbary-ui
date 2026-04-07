import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ADOPT_API_GATEWAY_COMMON_MANAGEMENT,
  ADOPT_INVENTORY_MANAGEMENT_BASE_URL
} from "../RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class OutwardService {
  baseUrl = ADOPT_INVENTORY_MANAGEMENT_BASE_URL;
  baseCommonUrl = ADOPT_API_GATEWAY_COMMON_MANAGEMENT;

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  constructor(private http: HttpClient) {}

  getMethod(url) {
    return this.http.get(this.baseUrl + url);
  }
  postMethod(url, data) {
    return this.http.post(this.baseUrl + url, data);
  }
  getAll(plandata) {
    return this.http.post(this.baseUrl + "/outwards", plandata);
  }
  save(data) {
    return this.http.post(this.baseUrl + "/outwards/save", data);
  }
  saveAllInventoryRequest(data) {
    return this.http.post(this.baseUrl + "/outwards/saveAllInventoryRequest", data);
  }
  update(data) {
    return this.http.post(this.baseUrl + "/outwards/update", data);
  }
  delete(data) {
    return this.http.delete(this.baseUrl + "/outwards/deleteOutWard?outwardId=" + data);
  }

  getAllProducts() {
    return this.http.get(this.baseUrl + "/product/getAllActiveProduct");
  }

  getItemss(productId) {
    return this.http.get(
      this.baseUrl + "/inventorySpecification/getAllInventorySpecByItemId?itemId=" + productId
    );
  }

  // getAllWareHouse() {
  //   return this.http.get(this.baseUrl + "/warehouseManagement/getAllWarehouseView");
  // }
  getAllStaff() {
    return this.http.get(this.baseUrl + "/staffuser/allActive");
  }
  getStaffUserByServiceArea() {
    return this.http.get(this.baseCommonUrl + "/serviceArea/viewStaffUserByServiceArea");
  }

  getAllCustomer() {
    return this.http.get(this.baseUrl + "/customers/getActiveCustomersList");
  }

  getAllInwardList(productId, destinationId, destinationType) {
    // `${this.baseUrl}/inwards/getInwardDetailsByProductAndWareHouseId?productId=` + productId + '&wareHouseId=' + wareHouseId
    return this.http.get(
      `${this.baseUrl}/inwards/getInwardDetailsByProductAndDestination?productId=` +
        productId +
        "&destinationId=" +
        destinationId +
        "&destinationType=" +
        destinationType
    );
  }

  getProductAvailableQTY(productId, destinationId, destinationType) {
    // `${this.baseUrl}/inwards/getInwardDetailsByProductAndWareHouseId?productId=` + productId + '&wareHouseId=' + wareHouseId
    return this.http.get(
      `${this.baseUrl}/outwards/getAvailableQtyDetailsByProductAndDestination?productId=` +
        productId +
        "&ownerId=" +
        destinationId +
        "&ownerType=" +
        destinationType
    );
  }

  postItems(productId, destinationId, destinationType, body) {
    // `${this.baseUrl}/inwards/getInwardDetailsByProductAndWareHouseId?productId=` + productId + '&wareHouseId=' + wareHouseId
    return this.http.post(
      `${this.baseUrl}/outwards/getItemForOutward?productId=` +
        productId +
        "&ownerId=" +
        destinationId +
        "&ownerType=" +
        destinationType,
      body
    );
  }

  getAllOutwardByProductAndStaff(productId, staffId) {
    return this.http.get(
      `${this.baseUrl}/outwards/getAllOutwardByProductAndStaff?productId=` +
        productId +
        "&staffId=" +
        staffId
    );
  }

  assignToCustomer(customerInventoryMapping) {
    return this.http.post(this.baseUrl + "/outwards/assignToCustomer", customerInventoryMapping);
  }
  getByStaffId(staffId) {
    return this.http.get(`${this.baseUrl}/outwards/getByStaffId?staffId=` + staffId);
  }
  updateMACMappingList(list) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/updateMACMappingList`, list);
  }
  getAllMACMappingByOutwardId(outwardId) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/getAllMACMappingByOutwardId?outwardId=` + outwardId
    );
  }

  saveCustomerMACMapping(list) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/saveMACMappingCustomer`, list);
  }
  deleteMacMapInCustomer(customerId, macAddress) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/deleteMacMapInCustomer?customerId=${customerId}&macAddress=${macAddress}`
    );
  }
  getMacMappingByCustomerIdAndOutwardId(customerId, outwardId, mappingId) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/getMacMappingByCustomerIdAndOutwardId?customerId=${customerId}&outwardId=${outwardId}&mappingId=${mappingId}`
    );
  }

  search(page, filter) {
    return this.http.post(
      `${this.baseUrl}/outwards/search?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id`,
      filter
    );
  }

  searchAssignInventories(page, staffId, filter) {
    return this.http.post(
      `${this.baseUrl}/outwards/searchAssignInventories?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id` +
        `&staffId=` +
        staffId,
      filter
    );
  }

  getAllAssignInventories(staffId, plandata) {
    return this.http.post(
      `${this.baseUrl}/outwards/getAllAssignInventories?staffId=` + staffId,
      plandata
    );
  }
  returnMethod(data) {
    return this.http.post(this.baseUrl + "/item/return", data);
  }
  changeItemCondition(itemId, condition) {
    return this.http.get(
      this.baseUrl + `/item/updateItemCondition?itemCondition=${condition}&itemId=${itemId}`
    );
  }
  changeItemItemWarranty(itemId, itemWarranty) {
    return this.http.get(
      this.baseUrl + `/item/updateItemWarranty?itemWarranty=${itemWarranty}&itemId=${itemId}`
    );
  }
  changeNewTypeMethod(data) {
    return this.http.post(this.baseUrl + "/item/updateItemTypeByList", data);
  }
  changeRefurbishedTypeMethod(itemId) {
    return this.http.get(
      this.baseUrl + "/item/updateItemCondition?itemCondition=Refurbished&itemId=" + itemId
    );
  }
  changeDamagedTypeMethod(itemId) {
    return this.http.get(
      this.baseUrl + "/item/updateItemCondition?itemCondition=Damaged&itemId=" + itemId
    );
  }
  changeWarrantyMethod(data) {
    return this.http.post(this.baseUrl + `/item/updateItemWarrantyByList`, data);
  }
  changeStatusMethod(data) {
    return this.http.post(this.baseUrl + "/item/updateItemStatusByList", data);
  }
  changeItemOwnershipStatusMethod(data) {
    return this.http.post(this.baseUrl + "/item/updateItemOwnerShipStatusByList", data);
  }

  showItems(outwardId, destinationId, destinationType, productId, body) {
    // `${this.baseUrl}/inwards/getInwardDetailsByProductAndWareHouseId?productId=` + productId + '&wareHouseId=' + wareHouseId
    return this.http.post(
      `${this.baseUrl}/outwards/getAssignOutwardItem?outwardId=` +
        outwardId +
        "&ownerId=" +
        destinationId +
        "&ownerType=" +
        destinationType +
        "&productId=" +
        productId,
      body
    );
  }
}
