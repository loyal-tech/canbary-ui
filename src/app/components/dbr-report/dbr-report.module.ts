import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DbrReportComponent } from "./dbr-report.component";

const routes = [{ path: "", component: DbrReportComponent }];

@NgModule({
  declarations: [DbrReportComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class DbrReportModule {}
