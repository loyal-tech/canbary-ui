import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ChargeManagementComponent } from "./charge-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: ChargeManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [ChargeManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ChargeManagementModule {}
