import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuditReportComponent } from "./audit-report/audit-report.component";

const routes: Routes = [
  {
    path: "",
    component: AuditReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditManagementRoutingModule {}
