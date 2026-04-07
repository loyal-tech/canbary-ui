import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TrialBillComponent } from "./trial-bill.component";

const routes = [{ path: "", component: TrialBillComponent }];

@NgModule({
  declarations: [TrialBillComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TrialBillModule {}
