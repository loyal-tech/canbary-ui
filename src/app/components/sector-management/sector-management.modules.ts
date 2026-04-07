import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { SecurityContext } from "@angular/compiler/src/core";
import { SectorManagementComponent } from "./sector-management.component";

const routes = [
  { path: "", component: SectorManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [SectorManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class SectorManagementtModules {}
