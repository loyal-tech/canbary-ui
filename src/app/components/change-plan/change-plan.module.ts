import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ChangePlanComponent } from "./change-plan.component";

const routes = [{ path: "", component: ChangePlanComponent }];

@NgModule({
  declarations: [ChangePlanComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ChangePlanModule {}
