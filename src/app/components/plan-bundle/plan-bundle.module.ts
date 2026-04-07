import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PlanBundleComponent } from "./plan-bundle.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: PlanBundleComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [PlanBundleComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class PlanBundleModule {}
