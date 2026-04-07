import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { ProfileService } from "src/app/service/profile.service";

@Component({
  selector: "app-profile-create",
  templateUrl: "./profile-create.component.html",
  styleUrls: ["./profile-create.component.scss"]
})
export class ProfileCreateComponent implements OnInit {
  profileTitle = RadiusConstants.PROFILE;
  isProfileEdit: boolean = false;
  profileFormGroup: FormGroup;
  searchData: {
    filter: {
      filterDataType: string;
      filterValue: string;
      filterColumn: string;
      filterOperator: string;
      filterCondition: string;
    }[];
  };
  public loginService: LoginService;
  editProfileId: any;
  statusOptions = RadiusConstants.status;
  typeList: any[] = [
    { label: "Number", value: "number" },
    { label: "Timestamp", value: "timestamp" }
  ];
  submitted: boolean = false;
  selectedType: string;
  viewProfileData: any;
  constructor(
    private fb: FormBuilder,
    loginService: LoginService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.loginService = loginService;
    this.editProfileId = this.route.snapshot.paramMap.get("profileId")!;
  }

  async ngOnInit() {
    if (this.editProfileId != null) {
      this.isProfileEdit = true;
      this.getProfileById(this.editProfileId);
    }
    this.profileFormGroup = this.fb.group({
      id: [""],
      name: ["", Validators.required],
      prefix: ["", Validators.required],
      status: ["", Validators.required],
      type: ["", Validators.required],
      startFrom: [""],
      year: [false],
      month: [false],
      day: [false],
      mvnoId: [""]
    });
    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ]
    };
  }
  onTypeChange(selectedValue: string): void {
    this.selectedType = selectedValue;

    if (selectedValue === "number") {
      this.profileFormGroup.controls["startFrom"].setValidators([Validators.required]);
      this.profileFormGroup.controls["startFrom"].updateValueAndValidity();
      this.clearTimestampValidators();
      this.resetTimestampCheckboxes();
    } else if (selectedValue === "timestamp") {
      this.profileFormGroup.controls["startFrom"].clearValidators();
      this.profileFormGroup.controls["startFrom"].updateValueAndValidity();
      this.profileFormGroup.controls["startFrom"].reset();
    }
  }

  onlyNumberKey(event: KeyboardEvent) {
    let specialKeys: Array<string> = [
      "Backspace",
      "Tab",
      "End",
      "Home",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown"
    ];

    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = event.currentTarget["value"];
    let next: string = current.concat(event.key);
    if (next && !String(next).match(/^[\d]*$/)) {
      event.preventDefault();
    }
  }

  clearTimestampValidators(): void {
    const timestampFields = ["year", "month", "day"];
    timestampFields.forEach(field => {
      if (this.profileFormGroup.controls[field]) {
        this.profileFormGroup.controls[field].clearValidators();
        this.profileFormGroup.controls[field].updateValueAndValidity();
      }
    });
  }

  resetTimestampCheckboxes(): void {
    const timestampFields = ["year", "month", "day"];
    timestampFields.forEach(field => {
      if (this.profileFormGroup.controls[field]) {
        this.profileFormGroup.controls[field].setValue(false);
      }
    });
  }

  onSubmit(): void {
    if (this.profileFormGroup.invalid) {
      console.error("Form is invalid");
      return;
    }
    const formData = this.profileFormGroup.value;
    if (this.isProfileEdit) {
      this.updateProfile(formData);
    } else {
      this.addProfile(formData);
    }
  }

  addProfile(formData: any): void {
    const url = "/custAccountProfile/create";
    this.profileService.postMethod(url, formData).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.submitted = false;
          this.profileFormGroup.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
          this.router.navigate(["/home/profile/list"]);
        } else {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  updateProfile(formData: any): void {
    const id = formData.id;
    const url = "/custAccountProfile/update/" + id;
    this.profileService.updateMethod(url, formData).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.submitted = false;
          this.profileFormGroup.reset();
          this.messageService.add({
            severity: "success",
            summary: "Updated Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });

          if (formData.status === "Inactive") {
            this.setDefaultProfile(id);
          }
          this.router.navigate(["/home/profile/list"]);
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  setDefaultProfile(id) {
    if (id) {
      const url = "/mvno/setDefaultProfile/" + id;
      this.profileService.updateMethod(url, id).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.responseMessage,
              icon: "far fa-check-circle"
            });
          } else {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.message,
              icon: "far fa-check-circle"
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }
  getProfileById(id) {
    if (id) {
      const url = "/custAccountProfile/get/" + id;
      this.profileService.getMethod(url).subscribe(
        (response: any) => {
          this.isProfileEdit = true;
          this.viewProfileData = response.custAccountProfilesList;
          this.selectedType = this.viewProfileData.type;
          if (this.selectedType) {
            this.onTypeChange(this.selectedType);
          }
          this.profileFormGroup.patchValue(this.viewProfileData);
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }
}
