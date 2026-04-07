import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { BillRunMasterComponent } from "./bill-run-master.component";

const routes = [{ path: "", component: BillRunMasterComponent }];

@NgModule({
  declarations: [BillRunMasterComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class BillRunMasterModule {}
