import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DiscountManagementComponent } from "./discount-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: DiscountManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [DiscountManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class DiscountManagementModule {}
