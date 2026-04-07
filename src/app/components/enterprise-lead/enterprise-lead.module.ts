import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { EnterpriseLeadComponent } from "./enterprise-lead.component";

const routes = [{ path: "", component: EnterpriseLeadComponent }];

@NgModule({
  declarations: [EnterpriseLeadComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class EnterpriseLeadModule {}
