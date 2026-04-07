import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TicketReasonComponent } from "./ticket-reason.component";

const routes = [{ path: "", component: TicketReasonComponent }];

@NgModule({
  declarations: [TicketReasonComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TicketReasonModule {}
