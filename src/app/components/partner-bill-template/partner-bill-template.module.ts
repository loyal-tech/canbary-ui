import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PartnerBilltemplateComponent } from "./partner-bill-template.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: PartnerBilltemplateComponent }];

@NgModule({
  declarations: [PartnerBilltemplateComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class PartnerBilltemplateModule {}
