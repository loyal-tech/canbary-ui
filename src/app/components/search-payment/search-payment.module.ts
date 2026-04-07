import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { SearchPaymentComponent } from "./search-payment.component";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: SearchPaymentComponent }];

@NgModule({
  declarations: [SearchPaymentComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class SearchPaymentModule {}
