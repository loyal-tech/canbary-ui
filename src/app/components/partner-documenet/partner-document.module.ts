import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PartnerDocumenetComponent } from "./partner-documenet.component";

const routes = [{ path: "", component: PartnerDocumenetComponent }];

@NgModule({
  declarations: [PartnerDocumenetComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class PartnerDocumenetModule {}
