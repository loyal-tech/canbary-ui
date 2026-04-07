import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TicketFindingComponent } from "./ticket-finding.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: TicketFindingComponent, canDeactivate: [DeactivateService] }
];

@NgModule({
  declarations: [TicketFindingComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class TicketFindingModule {}
