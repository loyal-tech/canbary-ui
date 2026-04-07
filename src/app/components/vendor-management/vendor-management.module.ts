import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VendorManagementComponent } from "./vendor-management.component";
import { RouterModule } from "@angular/router";
import { DeactivateService } from "src/app/service/deactivate.service";
import { SharedModule } from "src/app/shared/shared.module";

const routes = [{ path: "", component: VendorManagementComponent }];

@NgModule({
  declarations: [VendorManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class VendorManagementModule {}
