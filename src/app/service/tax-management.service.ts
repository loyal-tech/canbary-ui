import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class TaxManagementService {
  constructor(private http: HttpClient) {}
  taxTypeUrl = "";

  getAllTaxType() {
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJmaXJzdE5hbWVcIjpcImFkbWluXCIsXCJsYXN0TmFtZVwiOlwiYWRtaW5cIixcInVzZXJJZFwiOjEsXCJwYXJ0bmVySWRcIjoxLFwicm9sZXNMaXN0XCI6XCIxXCJ9IiwiZXhwIjoxNjM0NDQ1ODc5fQ.wrn3-gUdbM4NdnFx2MittQie2f17flB5aEoIa5vk7NE`,
    // });
    // return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + '/gettaxtypes', { headers });
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + "/gettaxtypes");
  }

  addTaxMethod(data) {
    return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + "/taxes", data);
  }

  updateTaxMethod(id, data) {
    return this.http.put(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + "/taxes/" + id, data);
  }

  getData() {
    return this.http.get(
      RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL +
        "/taxes/all" +
        "?mvnoId=" +
        localStorage.getItem("mvnoId")
    );
  }

  deleteTaxMethod(id) {
    return this.http.delete(
      RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL +
        "/taxes/" +
        id +
        "?mvnoId=" +
        localStorage.getItem("mvnoId")
    );
  }

  getTaxDetailById(id) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + "/taxes/" + id);
  }

  searchTax(data) {
    return this.http.post(
      RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL +
        "/taxes/list" +
        "?mvnoId=" +
        localStorage.getItem("mvnoId"),
      data
    );
  }

  TaxAllData(data) {
    return this.http.post(
      RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL +
        "/taxes/list" +
        "?mvnoId=" +
        localStorage.getItem("mvnoId"),
      data
    );
  }
}
