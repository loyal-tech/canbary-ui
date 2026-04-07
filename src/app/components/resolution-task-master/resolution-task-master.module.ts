import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { ResolutionTaskMasterComponent } from "./resolution-task-master.component";

const routes = [
  { path: "", component: ResolutionTaskMasterComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [ResolutionTaskMasterComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ResolutionTaskMasterModule {}
