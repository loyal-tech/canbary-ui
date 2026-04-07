import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { VoucherBatchComponent } from "./voucher-batch.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: VoucherBatchComponent },
];

@NgModule({
  declarations: [VoucherBatchComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class VoucherBatchModule {}
