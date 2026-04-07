import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { VasManagementComponent } from "./vas-management.component";

const routes = [
  { path: "", component: VasManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [VasManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class VasManagementModule {}
