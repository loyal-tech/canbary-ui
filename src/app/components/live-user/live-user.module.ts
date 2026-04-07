import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { LiveUserComponent } from "./live-user.component";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: LiveUserComponent }];

@NgModule({
  declarations: [LiveUserComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class LiveUserModule {}
