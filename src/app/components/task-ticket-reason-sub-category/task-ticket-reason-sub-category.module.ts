import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { TaskTicketReasonSubCategoryComponent } from "./task-ticket-reason-sub-category.component";

const routes = [
    { path: "", component: TaskTicketReasonSubCategoryComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
    declarations: [TaskTicketReasonSubCategoryComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TaskTicketReasonSubCategoryModule { }
