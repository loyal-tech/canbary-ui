import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PlanManagementComponent } from "./plan-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: PlanManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [PlanManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class PlanManagementModule {}
