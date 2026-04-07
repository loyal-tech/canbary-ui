import { NgModule } from "@angular/core";
import { Routes, RouterModule, CanActivate } from "@angular/router";
import { ProfileListComponent } from "./profile-list/profile-list.component";
import { AuthguardGuard } from "src/app/authguard.guard";
import { ProfileCreateComponent } from "./profile-create/profile-create.component";
import { ProfileComponent } from "./profile.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { MultiSelectModule } from "primeng/multiselect";

const routes: Routes = [
  {
    path: "",
    component: ProfileComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "list", pathMatch: "full" },
      { path: "list", component: ProfileListComponent, pathMatch: "full" },
      {
        path: "create",
        // canDeactivate: [DeactivateService],
        component: ProfileCreateComponent
      },
      {
        path: "edit/:profileId",
        canActivate: [AuthguardGuard],
        component: ProfileCreateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
