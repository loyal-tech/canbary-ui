import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { VoucherComponent } from "./voucher.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: VoucherComponent },
];

@NgModule({
  declarations: [VoucherComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class VoucherModule {}
