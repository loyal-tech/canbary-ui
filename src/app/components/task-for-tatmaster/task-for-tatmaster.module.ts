import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { TaskTATmasterComponent } from "./task-for-tatmaster.component";

const routes = [{ path: "", component: TaskTATmasterComponent, canDeactivate: [DeactivateService] }];

@NgModule({
    declarations: [TaskTATmasterComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TaskForTATmasterModule { }
