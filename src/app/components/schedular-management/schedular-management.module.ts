import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { SchedularManagementComponent } from "./schedular-management.component";

const routes = [
  { path: "", component: SchedularManagementComponent, canDeactivate: [DeactivateService] }
];

@NgModule({
  declarations: [SchedularManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule]
})
export class SchedularManagementModule {}
