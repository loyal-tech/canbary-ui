import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) { }

  baseUrl = RadiusConstants.ADOPT_WIFI_BASE_URL;

  getAllPlans() {
    return this.http.get(`${this.baseUrl}/plan`);
  }

  deletePlan(planId) {
    return this.http.delete(`${this.baseUrl}/deletePlan?planId=` + planId);
  }

  findPlanById(planId) {
    return this.http.get(`${this.baseUrl}/findPlanById?planId=` + planId)
  }

  addPlan(planData) {
    return this.http.post(`${this.baseUrl}/addPlan`, planData)
  }

  updatePlan(planData) {
    return this.http.put(`${this.baseUrl}/updatePlan`, planData)
  }

  findPlan(planName, planType) {
    return this.http.get(`${this.baseUrl}/findPlan?planName=` + planName + '&planType=' + planType)
  }

  updatePlanStatus(id, status) {
    return this.http.get(`${this.baseUrl}/updatePlanStatus?planId=` + id + "&status=" + status);
  }

}
