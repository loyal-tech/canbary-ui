import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { RejectedReasonMasterComponent } from "./rejected-reason-master.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: RejectedReasonMasterComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [RejectedReasonMasterComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class RejectedReasonMasterModule {}
