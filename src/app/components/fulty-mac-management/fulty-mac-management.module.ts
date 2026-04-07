import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { FultyMacManagementComponent } from "./fulty-mac-management.component";

const routes = [
    { path: "", component: FultyMacManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
    declarations: [FultyMacManagementComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class FultyMacManagementModule { }
