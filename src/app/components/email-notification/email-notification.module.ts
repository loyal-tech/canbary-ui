import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { EmailNotificationComponent } from "./email-notification.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: EmailNotificationComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [EmailNotificationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class EmailNotificationModule {}
