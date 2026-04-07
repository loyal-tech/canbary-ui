import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { FileUploadModule } from "primeng/fileupload";
import { DialogModule } from "primeng/dialog";
import { TaskCalendarDetails } from "./task-calendar-details-management.component";
const routes = [{ path: "", component: TaskCalendarDetails, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [TaskCalendarDetails],
  imports: [
    CommonModule,
    DialogModule,
    RouterModule.forChild(routes),
    SharedModule,
    FileUploadModule
  ]
})
export class TaskCalendarDetaillsManagementModule {}
