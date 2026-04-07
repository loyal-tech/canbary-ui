import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { LeadDocumentsComponent } from "./lead-documents.component";

const routes = [{ path: "", component: LeadDocumentsComponent }];

@NgModule({
  declarations: [LeadDocumentsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class LeadDocumentsModule {}
