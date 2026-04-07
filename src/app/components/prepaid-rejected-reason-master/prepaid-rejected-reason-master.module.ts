import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrepaidRejectedReasonMasterComponent } from "./prepaid-rejected-reason-master.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { RouterModule } from "@angular/router";
import { DividerModule } from "primeng/divider";
import { CardModule } from "primeng/card";
import { SharedModule } from "primeng/api";
import { NgxPaginationModule } from "ngx-pagination";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

const routes = [
  { path: "", component: PrepaidRejectedReasonMasterComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [PrepaidRejectedReasonMasterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CardModule,
    DividerModule,
    NgxPaginationModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PrepaidRejectedReasonMasterModule {}
