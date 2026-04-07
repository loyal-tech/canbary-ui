import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AcsMasterComponent } from "./acs-master.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: AcsMasterComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [AcsMasterComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class AcsMasterModules {}
