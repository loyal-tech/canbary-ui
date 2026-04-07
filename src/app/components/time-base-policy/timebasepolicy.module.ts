import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TimeBasePolicyComponent } from "./time-base-policy.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: TimeBasePolicyComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [TimeBasePolicyComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TimebasepolicyModule {}
