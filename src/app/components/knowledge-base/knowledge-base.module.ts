import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { KnowledgeBaseComponent } from "./knowledge-base.component";

const routes = [{ path: "", component: KnowledgeBaseComponent }];

@NgModule({
  declarations: [KnowledgeBaseComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class KnowledgeBaseModule {}
