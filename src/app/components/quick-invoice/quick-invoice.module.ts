import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { QuickInvoiceComponent } from "./quick-invoice.component";

const routes = [{ path: "", component: QuickInvoiceComponent }];

@NgModule({
  declarations: [QuickInvoiceComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class QuickInvoiceModule {}