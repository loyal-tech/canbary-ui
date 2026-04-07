import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { RadiusIpManagementComponent } from "./radius-ip.component";

const routes = [
  { path: "", component: RadiusIpManagementComponent, canDeactivate: [DeactivateService] }
];

@NgModule({
  declarations: [RadiusIpManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class RadiusIpManagementModule {}
