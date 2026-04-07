import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NotificationBaseService } from "./notification-base.service";

@Injectable({
  providedIn: "root",
})
export class TemplateManagementService extends NotificationBaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  getEventByName(eventName) {
    return this.get("/Event/findByName?eventName=" + eventName);
  }
  addNewtemplate(data) {
    return this.post("/Template/save", data);
  }
  updateTemplate(data) {
    return this.put("/Template/update?eventName=" + data.templateId, data);
  }
  getTemplates() {
    return this.get("/Template/all");
  }
}
