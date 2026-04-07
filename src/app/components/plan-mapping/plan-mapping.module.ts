import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PlanMappingComponent } from "./plan-mapping.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: PlanMappingComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [PlanMappingComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class PlanMappingModule {}

