import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ProformaInvoiceComponent } from "./proforma-invoice.component";

const routes = [{ path: "", component: ProformaInvoiceComponent }];

@NgModule({
  declarations: [ProformaInvoiceComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class PerformaInvoiceModule {}
