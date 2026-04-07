import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeviceDriverComponent } from "./device-driver.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: DeviceDriverComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [DeviceDriverComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class DeviceDriverModule {}
