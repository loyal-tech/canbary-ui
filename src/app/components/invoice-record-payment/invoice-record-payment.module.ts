import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { InvoiceRecordPaymentComponent } from "./invoice-record-payment.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: InvoiceRecordPaymentComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [InvoiceRecordPaymentComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class InvoiceRecordPaymentModule {}
