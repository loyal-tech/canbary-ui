import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { LeasedLineCustomerComponent } from "./leased-line-customer.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: LeasedLineCustomerComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [LeasedLineCustomerComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class LeasedLineCustomerModule {}
