import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DunningRulesComponent } from "./dunning-rules.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: DunningRulesComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [DunningRulesComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class DunningRulesModule {}
