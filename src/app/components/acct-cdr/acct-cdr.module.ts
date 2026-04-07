import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AcctCdrComponent } from "./acct-cdr.component";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: AcctCdrComponent }];

@NgModule({
  declarations: [AcctCdrComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class AcctCdrModule {}
