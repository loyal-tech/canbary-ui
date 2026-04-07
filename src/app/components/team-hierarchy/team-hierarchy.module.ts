import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TeamHierarchyComponent } from "./team-hierarchy.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { DialogModule } from "primeng/dialog";
const routes = [
  { path: "", component: TeamHierarchyComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [TeamHierarchyComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class TeamHierarchyModule {}
