import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ButtonModule } from "primeng/button";

import { TacacsDeviceComponent } from "./tacacs-device.component";

const routes = [{ path: "", component: TacacsDeviceComponent }];
@NgModule({
  declarations: [TacacsDeviceComponent],
  imports: [CommonModule, ButtonModule, RouterModule.forChild(routes), SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TacacsDeviceModule {}
