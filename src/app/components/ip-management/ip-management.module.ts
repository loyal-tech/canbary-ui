import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { IpManagementComponent } from "./ip-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: IpManagementComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [IpManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class IpManagementModule {}
