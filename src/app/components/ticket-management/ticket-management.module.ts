import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TicketManagementComponent } from "./ticket-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from "primeng/dialog";
const routes = [
  { path: "", component: TicketManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [TicketManagementComponent],
  imports: [CommonModule, DialogModule, RouterModule.forChild(routes), SharedModule, FileUploadModule ],
})
export class TicketManagementModule {}
