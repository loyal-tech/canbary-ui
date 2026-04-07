import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";

import { ButtonModule } from 'primeng/button';
import { TacasManagementComponent } from "./tacas-management.component";




const routes = [{ path: "", component: TacasManagementComponent}];
@NgModule({
    declarations:[TacasManagementComponent],
    imports:[CommonModule,
        ButtonModule,
        RouterModule.forChild(routes),
        SharedModule
        
    ]
})
export class TacasManagementModule{}