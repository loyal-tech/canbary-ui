import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from "primeng/dialog";
import { TaskTicketManagementComponent } from "./task-ticket-management.component";
const routes = [
    { path: "", component: TaskTicketManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
    declarations: [TaskTicketManagementComponent],
    imports: [CommonModule, DialogModule, RouterModule.forChild(routes), SharedModule, FileUploadModule],
})
export class TaskTicketManagementModule { }
