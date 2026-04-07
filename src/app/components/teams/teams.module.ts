import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TeamsComponent } from "./teams.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: TeamsComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [TeamsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TeamsModule {}
