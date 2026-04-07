import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ProfileComponent } from "./profile.component";
import { ProfileListComponent } from "./profile-list/profile-list.component";
import { ProfileCreateComponent } from "./profile-create/profile-create.component";
import { ProfileRoutingModule } from "./profile-routing.module";

const routes = [{ path: "", component: ProfileComponent }];

@NgModule({
  declarations: [ProfileComponent, ProfileListComponent, ProfileCreateComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, ProfileRoutingModule]
})
export class ProfileModule {}
