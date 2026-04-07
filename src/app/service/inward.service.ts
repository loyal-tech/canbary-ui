import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { type } from "os";
import { ADOPT_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class InwardService {
  baseUrl = ADOPT_INVENTORY_MANAGEMENT_BASE_URL;

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  constructor(private http: HttpClient) {}

  // private baseUrll = 'http://localhost:30083/api/v1/AdoptInventoryManagement/specificationParameters/getSpecificParametersByid?product_id=1000';

  // getSpecificParametersById(productId: number): Observable<any> {
  //   const url = `${this.baseUrll}/getSpecificParametersByid?product_id=${productId}`;
  //   return this.http.get(url);
  // }

  getAll(plandata) {
    return this.http.post(this.baseUrl + "/inwards", plandata);
  }
  save(data) {
    return this.http.post(this.baseUrl + "/inwards/save", data);
  }
  update(data) {
    return this.http.post(this.baseUrl + "/inwards/update", data);
  }
  delete(data) {
    return this.http.delete(this.baseUrl + "/inwards/deleteInward?inwardId=" + data);
  }

  getAllProducts() {
    return this.http.get(this.baseUrl + "/product/getAllActiveProduct");
  }

  getAllWareHouse() {
    return this.http.get(this.baseUrl + "/warehouseManagement/getAllActiveWarehouse");
  }

  getInwardMacMapping(inwardId) {
    return this.http.get(`${this.baseUrl}/inoutWardMacMapping/getbyinwardid?id=${inwardId}`);
  }

  getOutwardMacMapping(inwardId) {
    return this.http.get(`${this.baseUrl}/inoutWardMacMapping/getbyoutwardid?id=${inwardId}`);
  }

  saveInwardMACMapping(list) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/save?mvnoId=${this.mvnoId}`, list);
  }
  deleteMacMapping(mappingObject) {
    return this.http.get(`${this.baseUrl}/inoutWardMacMapping/deletemac?itemId=${mappingObject}`);
  }

  search(page, filter) {
    return this.http.post(
      `${this.baseUrl}/inwards/search?page=` +
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

  getAllParameter(url) {
    return this.http.get(`${this.baseUrl}${url}`);
  }

  getAllInwardByProductAndStaff(productId, staffId) {
    return this.http.get(
      `${this.baseUrl}/inwards/getAllInwardByProductAndStaff?productId=` +
        productId +
        "&staffId=" +
        staffId
    );
  }

  getAllItemBasedOnProduct(productId, ownerId, ownerType) {
    return this.http.get(
      `${this.baseUrl}/outwards/getItemHistoryByProduct?productId=` +
        productId +
        "&ownerId=" +
        ownerId +
        "&ownerType=" +
        ownerType
    );
  }

  getAllInwardByProductAndStaffforpopandserivearea(productId, staffId) {
    return this.http.get(
      `${this.baseUrl}/inwards/getAllInwardByProductAndStaffforpopandserivearea?productId=` +
        productId +
        "&staffId=" +
        staffId
    );
  }

  getAllInwardByProductAndStaffforPopandSeriveareaandCustomer(productId, staffId) {
    return this.http.get(
      `${this.baseUrl}/inwards/getAllInwardByProductAndStaffforPopandSeriveareaandCustomer?productId=` +
        productId +
        "&staffId=" +
        staffId
    );
  }
  assignToCustomer(customerInventoryMapping) {
    return this.http.post(this.baseUrl + "/inwards/assignToCustomer", customerInventoryMapping);
  }
  // getAllMACMappingByExternalItemId(inwardId) {
  //   return this.http.get(
  //     `${this.baseUrl}/externalitemmacserialmapping/getExternalItemGroupMacSerialMapping?externalItemId=` +
  //       inwardId
  //   );
  // }
  getAllMACMappingByExternalItemId(inwardId) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/getAllMACMappingByExternalId?external_id=` + inwardId
    );
  }
  getAllMACMappingByInwardId(inwardId) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/getAllMACMappingByInwardId?inward_id=` + inwardId
    );
  }
  getAllMACMappingByInwardd(inward_id, inOutMappingId, inventoryType) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/getAllMACByExstingMacType?inOutMappingId=` +
        inOutMappingId +
        "&inventoryType=" +
        inventoryType +
        "&inward_id=" +
        inward_id
    );
  }

  updateMACMappingList(list) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/updateMACMappingList`, list);
  }
  getById(inwardId) {
    return this.http.get(`${this.baseUrl}/inwards/` + inwardId);
  }
  getByExternalItemId(inwardId) {
    return this.http.get(`${this.baseUrl}/externalitemmanagement/` + inwardId);
  }
  getAllAssignInventories(staffId, plandata) {
    return this.http.post(
      `${this.baseUrl}/inwards/getAllAssignInventories?staffId=` + staffId,
      plandata
    );
  }
  getSerializedItemCustomerInventoryMappingByStaffId(staffId, data) {
    return this.http.post(
      `${this.baseUrl}/inwards/getCustomerInventoryMappingByStaffId?isGetSerializedItem=true&staffId=` +
        staffId,
      data
    );
  }
  getNonSerializedItemCustomerInventoryMappingByStaffId(staffId, data) {
    return this.http.post(
      `${this.baseUrl}/inwards/getCustomerInventoryMappingByStaffId?isGetSerializedItem=false&staffId=` +
        staffId,
      data
    );
  }
  getSerializedItemServiceAreaByInventoryMappingByStaffId(staffId, data) {
    return this.http.post(
      `${this.baseUrl}/inwards/getServiceAreaByInventoryMappingByStaffId?isGetSerializedItem=true&staffId=` +
        staffId,
      data
    );
  }
  getNonSerializedItemServiceAreaByInventoryMappingByStaffId(staffId, data) {
    return this.http.post(
      `${this.baseUrl}/inwards/getServiceAreaByInventoryMappingByStaffId?isGetSerializedItem=false&staffId=` +
        staffId,
      data
    );
  }
  getSerializedItemPopByInventoryMappingByStaffId(staffId, data) {
    return this.http.post(
      `${this.baseUrl}/inwards/getPopByInventoryMappingByStaffId?isGetSerializedItem=true&staffId=` +
        staffId,
      data
    );
  }
  getNonSerializedItemPopByInventoryMappingByStaffId(staffId, data) {
    return this.http.post(
      `${this.baseUrl}/inwards/getPopByInventoryMappingByStaffId?isGetSerializedItem=false&staffId=` +
        staffId,
      data
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
  assignToPop(customerInventoryMapping) {
    return this.http.post(this.baseUrl + "/inwards/assignToEndOwner", customerInventoryMapping);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  getByOwnerId(data) {
    return this.http.post(`${this.baseUrl}/inwards/getByOwnerIdAndType`, data);
  }

  downloadInvoice(type: any): any {
    const url = RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + `${type}`;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], { type: "application/pdf" });
      })
    );
  }

  postItems(inwardId, productId, destinationId, destinationType, body) {
    // `${this.baseUrl}/inwards/getInwardDetailsByProductAndWareHouseId?productId=` + productId + '&wareHouseId=' + wareHouseId
    return this.http.post(
      `${this.baseUrl}/inwards/getItemForInward?inwardId=` +
        inwardId +
        "&productId=" +
        productId +
        "&ownerId=" +
        destinationId +
        "&ownerType=" +
        destinationType,
      body
    );
  }

  getAllParameterHistory(inwardId, paramId) {
    return this.http.get(
      `${this.baseUrl}/inventorySpecification/getAllParameterHistoryByParamId/${inwardId}/${paramId}`
    );
  }

  getByItemId(itemId) {
    return this.http.get(
      `${this.baseUrl}/inventorySpecification/getAllInventorySpecByItemId?itemId=` + itemId
    );
  }

  updateCustomerInventoryParams(custId, data) {
    return this.http.put(`${this.baseUrl}/inwards/cust/params/${custId}`, data);
  }

  getInventoryParamsByMappingID(custServiceId) {
    return this.http.get(
      `${this.baseUrl}/inventorySpecification/custParamByMappingId?custInvId=${custServiceId}`
    );
  }
  deleteMapMac(data) {
    return this.http.delete(this.baseUrl + "/inwards/item/" + data);
  }
}
