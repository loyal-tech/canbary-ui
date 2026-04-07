import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { SmsNotificationComponent } from "./sms-notification.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: SmsNotificationComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [SmsNotificationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class SmsNotificationModule {}
