import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PlanGroupComponent } from "./plan-group.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { TableModule } from "primeng/table";

const routes = [{ path: "", component: PlanGroupComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [PlanGroupComponent],
  imports: [CommonModule, TableModule, RouterModule.forChild(routes), SharedModule],
})
export class PlanGroupModule {}
