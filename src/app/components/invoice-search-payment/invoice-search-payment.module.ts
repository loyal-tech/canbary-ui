import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { InvoiceSearchPaymentComponent } from "./invoice-search-payment.component";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: InvoiceSearchPaymentComponent }];

@NgModule({
  declarations: [InvoiceSearchPaymentComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class InvoiceSearchPaymentModule {}
