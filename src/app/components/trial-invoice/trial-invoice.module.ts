import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TrialInvoiceComponent } from "./trial-invoice.component";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: TrialInvoiceComponent }];

@NgModule({
  declarations: [TrialInvoiceComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class TrialInvoiceModule {}
