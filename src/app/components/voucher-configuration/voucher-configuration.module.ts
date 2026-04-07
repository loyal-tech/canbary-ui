import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { VoucherConfigurationComponent } from "./voucher-configuration.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: VoucherConfigurationComponent},
];

@NgModule({
  declarations: [VoucherConfigurationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class VoucherConfigurationModule {}
