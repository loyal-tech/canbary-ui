import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { MyAchievementComponent } from "./my-achievement.component";

const routes = [{ path: "", component: MyAchievementComponent }];

@NgModule({
  declarations: [MyAchievementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class MyAchievementModule {}
