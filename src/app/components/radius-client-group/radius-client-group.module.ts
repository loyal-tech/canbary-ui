import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RadiusClientGroupComponent } from "./radius-client-group.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: RadiusClientGroupComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [RadiusClientGroupComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class RadiusClientGroupModule {}
