import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TicketReasonCategoryComponent } from "./ticket-reason-category.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: TicketReasonCategoryComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [TicketReasonCategoryComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TicketReasonCategoryModule {}
