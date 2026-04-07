import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { TaskTicketSubCategoryComponent } from "./task-ticket-sub-category.component";

const routes = [
    { path: "", component: TaskTicketSubCategoryComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
    declarations: [TaskTicketSubCategoryComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TaskTicketSubCategoryModule { }
