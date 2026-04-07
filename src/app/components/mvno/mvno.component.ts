import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { MvnoService } from "src/app/service/mvno.service";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-mvno",
  templateUrl: "./mvno.component.html",
  styleUrls: ["./mvno.component.css"]
})
export class MvnoComponent implements OnInit {
  mvnoForm: FormGroup;
  searchMvnoForm: FormGroup;
  submitted = false;
  searchSubmitted = false;
  mvnoData: any = [];
  unlimitedMlanValue: any;
  statusValue: any;
  isShown: boolean = true;
  //Used for pagination
  totalRecords: String;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  status = [{ label: "Active" }, { label: "Inactive" }];
  editMode = false;
  OneMvnoData: any = [];
  editMvnoId: number;
  logo: any;

  constructor(
    private mvnoService: MvnoService,
    private radiusUtility: RadiusUtility,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.getAllMvnos();
    // this.statusValue = 'Active';
  }
  mvno = {
    mvnoId: 0,
    name: "",
    username: "",
    password: "",
    logo: "",
    organisation: "",
    status: ""
  };

  ngOnInit(): void {
    this.mvnoForm = this.fb.group({
      name: ["", Validators.required],
      username: [""],
      password: ["", Validators.required],
      organisation: ["", Validators.required],
      logo: ["", Validators.required],
      status: ["", Validators.required]
    });
    this.searchMvnoForm = this.fb.group({
      name: [null]
    });
  }

  getAllMvnos() {
    this.mvnoService.getAllMvnos().subscribe(
      (response: any) => {
        this.mvnoData = response;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  clearFormData() {
    this.editMode = false;
    this.submitted = false;
    this.isShown = true;
    this.mvnoForm.setValue({
      name: "",
      username: "",
      password: "",
      logo: "",
      organisation: "",
      status: ""
    });
  }

  saveMvno() {
    this.submitted = true;
    if (this.mvnoForm.valid) {
      if (this.editMode) {
        this.mvno = this.mvnoForm.value;
        this.mvno.mvnoId = this.editMvnoId;
        this.updateMvno(this.mvno);
      } else {
        this.addNewMvno(this.mvnoForm.value);
      }
    }
  }

  addNewMvno(data) {
    // this.mvnoService.addMvno(data).subscribe(
    //   (response: any) => {
    //     this.getAllMvnos();
    //     this.clearFormData();
    //     this.mvnoData = response;
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successfully',
    //       detail: response.message,
    //       icon: 'far fa-check-circle',
    //     });
    //
    //   },
    //   (error: any) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: error.error.errorMessage,
    //       icon: 'far fa-times-circle',
    //     });
    //
    //   }
    // );

    this.updateLogo(this.logo, 28);
    // const uploadImageData = new FormData();
    // uploadImageData.append('file', this.logo, this.logo.name);
    // uploadImageData.append('mvnoId', '25');
    // console.log("updating logo  : ", 25);
    // this.mvnoService.updateLogo(this.logo, 26);
  }

  updateLogo(file, mvnoId) {
    this.mvnoService.updateLogo(file, 34).subscribe(
      (response: any) => {
        this.getAllMvnos();
        this.clearFormData();
        this.mvnoData = response;
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  updateMvno(data) {
    this.mvnoService.updateMvno(data).subscribe(
      (response: any) => {
        this.getAllMvnos();
        this.clearFormData();
        this.mvnoData = response;
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  editMvnoById(mvnoId, index) {
    this.editMode = true;
    index = this.radiusUtility.getIndexOfSelectedRecord(index, this.currentPage, this.itemsPerPage);
    this.mvnoForm.patchValue({
      name: this.mvnoData.mvnoList[index].name,
      username: this.mvnoData.mvnoList[index].username,
      password: this.mvnoData.mvnoList[index].password,
      logo: this.mvnoData.mvnoList[index].logoName,
      organisation: this.mvnoData.mvnoList[index].organisation,
      status: this.mvnoData.mvnoList[index].status,
      isTwoFactorEnabled: this.mvnoData.mvnoList[index].isTwoFactorEnabled
      // startDate: startdate,
      // endDate: enddate,
    });
    this.editMvnoId = mvnoId;
  }

  deleteMvnoById(mvnoId) {
    this.mvnoService.deleteMvno(mvnoId).subscribe(
      (response: any) => {
        this.getAllMvnos();
        this.clearFormData();
        this.mvnoData = response;
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.clearFormData();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  findMvnoById(mvnoId) {
    this.mvnoService.findMvnoById(mvnoId).subscribe(
      (response: any) => {
        this.OneMvnoData = response;
        this.mvno = this.OneMvnoData.mvno;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  changeStatusToInActive(id) {
    this.mvnoService.updateMvnoStatus(id, RadiusConstants.IN_ACTIVE).subscribe(
      (response: any) => {
        this.getAllMvnos();
        this.clearFormData();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.clearFormData();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  changeStatusToActive(id) {
    this.mvnoService.updateMvnoStatus(id, RadiusConstants.ACTIVE).subscribe(
      (response: any) => {
        this.getAllMvnos();
        this.clearFormData();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.clearFormData();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  deleteConfirm(mvnoId) {
    this.confirmationService.confirm({
      message: "Do you want to delete this MVNO?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteMvnoById(mvnoId);
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
      }
    });
  }

  searchMvno() {
    this.currentPage = 1;
    this.searchSubmitted = true;
    if (this.searchMvnoForm.value.name != null) {
      this.mvnoService.findMvno(this.searchMvnoForm.value.name).subscribe(
        (response: any) => {
          this.clearFormData();
          this.mvnoData = response;
          this.totalRecords = this.mvnoData.mvnoList.length;
        },
        (error: any) => {
          this.clearFormData();
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  clearSearchForm() {
    this.clearFormData();
    this.searchSubmitted = false;
    this.currentPage = 1;
    this.searchMvnoForm.reset();
    this.getAllMvnos();
  }

  handleFileInput(files: FileList) {
    this.logo = files[0];
  }

  pageChanged(pageNumber) {
    this.clearFormData();
    this.currentPage = pageNumber;
  }
}
