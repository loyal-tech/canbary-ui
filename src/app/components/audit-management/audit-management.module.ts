import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuditManagementRoutingModule } from "./audit-management-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { AuditReportComponent } from "./audit-report/audit-report.component";

@NgModule({
  declarations: [AuditReportComponent],
  imports: [CommonModule, SharedModule, AuditManagementRoutingModule],
  exports: [AuditReportComponent]
})
export class AuditManagementModule {}
