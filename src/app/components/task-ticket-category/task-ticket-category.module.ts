import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { TaskTicketCategoryComponent } from "./task-ticket-category.component";

const routes = [
    { path: "", component: TaskTicketCategoryComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
    declarations: [TaskTicketCategoryComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TaskTicketCategoryModule { }
