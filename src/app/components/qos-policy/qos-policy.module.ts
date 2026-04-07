import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { QosPolicyComponent } from "./qos-policy.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: QosPolicyComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [QosPolicyComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class QosPolicyModule {}
