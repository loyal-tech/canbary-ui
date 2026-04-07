import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { KpiManagementComponent } from "./kpi-management.component";

const routes = [{ path: "", component: KpiManagementComponent }];

@NgModule({
  declarations: [KpiManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class KpiManagementModule {}
