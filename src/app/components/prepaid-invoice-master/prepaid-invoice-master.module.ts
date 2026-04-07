import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PrepaidInvoiceMasterComponent } from "./prepaid-invoice-master.component";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: PrepaidInvoiceMasterComponent }];

@NgModule({
  declarations: [PrepaidInvoiceMasterComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class PrepaidInvoiceMasterModule {}
