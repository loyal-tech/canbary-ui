import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { UserProfileComponent } from "./user-profile.component";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: UserProfileComponent }];

@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, DialogModule, RouterModule.forChild(routes), SharedModule],
})
export class UserProfileModule {}
