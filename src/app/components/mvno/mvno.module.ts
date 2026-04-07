import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { MvnoComponent } from "./mvno.component";

const routes = [{ path: "", component: MvnoComponent }];

@NgModule({
  declarations: [MvnoComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class MvnoModule {}
