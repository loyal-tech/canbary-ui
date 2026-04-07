import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TemplateManagementComponent } from "./template-management.component";

const routes = [{ path: "", component: TemplateManagementComponent }];

@NgModule({
  declarations: [TemplateManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TemplateManagementModule {}
