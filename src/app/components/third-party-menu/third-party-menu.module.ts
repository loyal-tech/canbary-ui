import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { InputSwitchModule } from "primeng/inputswitch";
import { ThirdPartyMenuComponent } from "./third-party-menu.component";

const routes = [{ path: "", component: ThirdPartyMenuComponent }];

@NgModule({
  declarations: [ThirdPartyMenuComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, InputSwitchModule]
})
export class ThirdPartyMenuModule {}
