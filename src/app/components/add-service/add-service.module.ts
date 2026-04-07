import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { AddServiceComponent } from './add-service.component';
import { DeactivateService } from "src/app/service/deactivate.service";
import { RouterModule } from "@angular/router";
import { SharedModule } from "primeng/api";
import { AccordionModule } from "primeng/accordion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddServiceComponent } from "./add-service.component";

const routes = [
  // { path: "", component: AddServiceComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    AddServiceComponent
  ],
})
export class AddServiceModule {}
