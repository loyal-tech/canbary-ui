import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class FeedbackService {
  constructor(private http: HttpClient) {}
  taxTypeUrl = "";

  createFeedback(data) {
    return this.http.post(
      RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + "/feedbackconfig/save",
      data
    );
  }

  updateFeedback(id, data) {
    return this.http.put(
      RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + "/feedbackconfig/update/" + id,
      data
    );
  }

  deleteFeedback(id) {
    return this.http.delete(
      RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + "/feedbackconfig/delete/" + id
    );
  }

  getFeedbackById(id) {
    return this.http.get(
      RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + "/feedbackconfig/getById/" + id
    );
  }

  getAllFeedback() {
    return this.http.get(
      RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + "/feedbackconfig/getAll"
    );
  }
}
