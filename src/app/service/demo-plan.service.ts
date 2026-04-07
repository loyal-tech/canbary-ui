import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class DemoPlanService {
  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.ADOPT_CONTROLLER_BASE_URL;

  getAllPlans() {
    return this.http.get(`${this.baseUrl}/plan`);
  }

  deletePlan(planId) {
    return this.http.delete(`${this.baseUrl}/deletePlan?planId=` + planId);
  }

  findPlanById(planId) {
    return this.http.get(`${this.baseUrl}/findPlanById?planId=` + planId);
  }

  addPlan(planData) {
    return this.http.post(`${this.baseUrl}/addPlan`, planData);
  }

  updatePlan(planData) {
    return this.http.put(`${this.baseUrl}/updatePlan`, planData);
  }

  findPlan(planName) {
    return this.http.get(`${this.baseUrl}/findPlan?planName=` + planName);
  }

  updatePlanStatus(id, status) {
    return this.http.get(`${this.baseUrl}/updatePlanStatus?planId=` + id + "&status=" + status);
  }
}
