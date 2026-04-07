import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TaskCalendarComponent } from "./task-calendar.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
FullCalendarModule.registerPlugins([
    // register FullCalendar plugins
    dayGridPlugin,
    interactionPlugin
]);
const routes = [{ path: "", component: TaskCalendarComponent }];

@NgModule({
    declarations: [TaskCalendarComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule, FullCalendarModule],
    exports: [TaskCalendarComponent]
})
export class TaskCalendarModule { }
