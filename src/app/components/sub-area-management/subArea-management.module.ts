import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { SubAreaManagementComponent } from "./subArea-management.component";

const routes = [
  { path: "", component: SubAreaManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [SubAreaManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class SubAreaManagementModule {}
