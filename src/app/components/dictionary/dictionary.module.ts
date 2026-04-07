import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DictionaryComponent } from "./dictionary.component";

const routes = [{ path: "", component: DictionaryComponent }];

@NgModule({
  declarations: [DictionaryComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class DictionaryModule {}
