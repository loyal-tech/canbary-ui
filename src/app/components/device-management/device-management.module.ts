import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeviceManagementComponent } from "./device-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: DeviceManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [DeviceManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class DeviceManagementModule {}
