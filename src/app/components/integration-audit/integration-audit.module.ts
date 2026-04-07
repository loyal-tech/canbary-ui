import { NgModule } from "@angular/core";
import { Routes, RouterModule, CanActivate } from "@angular/router";
import { AuthguardGuard } from "src/app/authguard.guard";
import { DeactivateService } from "src/app/service/deactivate.service";
import { MultiSelectModule } from "primeng/multiselect";
import { IntegrationAuditComponent } from "./integration-audit.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { DialogModule } from "primeng/dialog";

const routes: Routes = [
  {
    path: "",
    component: IntegrationAuditComponent,
  },
];

@NgModule({
  declarations: [IntegrationAuditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class IntegrationAuditModule {}
