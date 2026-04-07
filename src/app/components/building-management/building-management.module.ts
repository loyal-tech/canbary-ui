import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { BuildingManagementComponent } from "./building-management.component";

const routes = [
  { path: "", component: BuildingManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [BuildingManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class BuildingManagementModule {}
