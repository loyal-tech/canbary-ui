import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { SCHEDULARMANAGEMENT } from "src/app/RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { SchedularManagementService } from "src/app/service/schedular-management.service";

@Component({
  selector: "app-schedular-management",
  templateUrl: "./schedular-management.component.html",
  styleUrls: ["./schedular-management.component.css"]
})
export class SchedularManagementComponent implements OnInit {
  schedularForm: FormGroup;
  title = SCHEDULARMANAGEMENT;
  detailView: boolean = false;
  listView: boolean = true;
  createView: boolean = false;
  currentPage = 1;
  searchkey: any = [];
  showItemPerPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  schedularList: any;
  totalRecords: any;
  searchData: any;
  first = 0;
  isSchedularEdit: boolean = false;
  submitted: boolean = false;
  scheduleTypeList: any = [
    {
      label: "DAILY",
      value: "DAILY"
    },
    {
      label: "WEEKLY",
      value: "WEEKLY"
    },
    {
      label: "MONTHLY",
      value: "MONTHLY"
    }
  ];
  scheduleNameList: any = [
    {
      label: "Auto_Invoice_Export",
      value: "Auto_Invoice_Export"
    },
    {
      label: "Auto_Invoice_Distribution",
      value: "Auto_Invoice_Distribution"
    }
  ];
  dayOfMonthOptions: any[] = [];
  viewSchedularDate: any;
  status = [{ label: "Active" }, { label: "Inactive" }];
  schedularId: any;
  mvnoId: string;
  search: any;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private service: SchedularManagementService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.schedularForm = this.fb.group({
      id: [""],
      schedulerName: ["", Validators.required],
      schedulerTime: ["", Validators.required],
      scheduleType: ["", Validators.required],
      status: ["", Validators.required],
      weekly: [null],
      dayOfMonth: [""],
      mvnoId: [this.mvnoId]
    });

    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: "",
      pageSize: ""
    };
    this.dayOfMonthOptions = Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      value: i + 1
    }));
    this.schedularForm.get("scheduleType")?.valueChanges.subscribe(type => {
      this.onScheduleTypeChange(type);
    });
  }

  canExit() {
    if (!this.schedularForm.dirty) return true;
    {
      return Observable.create((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          header: "Alert",
          message: "The filled data will be lost. Do you want to continue? (Yes/No)",
          icon: "pi pi-info-circle",
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.next(false);
            observer.complete();
          }
        });
        return false;
      });
    }
  }

  createSchedular() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.isSchedularEdit = false;
    this.schedularForm.reset();
    this.schedularForm.patchValue({ mvnoId: this.mvnoId });
  }

  searchSchedular() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.isSchedularEdit = false;
    this.schedularForm.reset();
    this.schedularForm.patchValue({ mvnoId: this.mvnoId });
  }

  getAllSchedularList(list) {
    let size;
    this.searchkey = "";
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    const url = "/schedulers/search";
    this.searchData.page = this.currentPage;
    this.searchData.pageSize = size;
    if (this.search) {
      this.searchData.filters[0].filterValue = this.search;
    } else {
      this.searchData.filters[0].filterValue = "";
    }

    this.service.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.schedularList = response?.dataList;
        this.totalRecords = response?.totalRecords;
      },
      (error: any) => {
        // console.log(error, 'error')
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  loadSchedulers(event: any) {
    if (this.itemsPerPage !== event.rows) {
      this.itemsPerPage = event.rows;
      this.currentPage = 1;
      this.first = 0;
    } else {
      this.itemsPerPage = event.rows;
      this.currentPage = Math.floor(event.first / this.itemsPerPage) + 1;
      this.first = event.first;
    }
    // this.isSearchActive
    //   ? this.searchDatabasebyName(this.currentPage)
    //   : this.getDatabaseWithPagination();
    this.getAllSchedularList("");
  }

  onScheduleTypeChange(type: string): void {
    this.submitted = false;
    this.schedularForm.patchValue({ weekly: null, dayOfMonth: "" });

    if (type === "WEEKLY") {
      this.schedularForm.get("weekly")?.setValidators([Validators.required]);
      this.schedularForm.get("dayOfMonth")?.clearValidators();
    } else if (type === "MONTHLY") {
      this.schedularForm.get("dayOfMonth")?.setValidators([Validators.required]);
      this.schedularForm.get("weekly")?.clearValidators();
    } else {
      this.schedularForm.get("weekly")?.clearValidators();
      this.schedularForm.get("dayOfMonth")?.clearValidators();
    }

    this.schedularForm.get("weekly")?.updateValueAndValidity();
    this.schedularForm.get("dayOfMonth")?.updateValueAndValidity();
  }

  addOrUpdateScheduler() {
    this.submitted = true;
    if (this.schedularForm.invalid) {
      return;
    }

    const formData = { ...this.schedularForm.value };

    const isUpdate = this.isSchedularEdit;
    if (typeof formData.schedulerTime === "object") {
      formData.schedulerTime = this.formatSchedularForm(formData.schedulerTime);
    }

    const url = isUpdate ? `/schedulers/update/${this.schedularId}` : "/schedulers/save";
    const method = isUpdate ? this.service.updateMethod : this.service.postMethod;

    method.call(this.service, url, formData).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Schedular Name already exists",
            icon: "pi pi-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: isUpdate ? "Scheduler updated successfully" : "Scheduler created successfully",
            icon: "pi pi-check-circle"
          });
          this.schedularForm.reset();
          this.schedularForm.patchValue({ mvnoId: this.mvnoId });
          this.submitted = false;
          this.createView = false;
          this.listView = true;
          // this.getAllSchedularList("");
          this.isSchedularEdit = false;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.ERROR || "Operation failed",
          icon: "pi pi-times-circle"
        });
      }
    );
  }

  editSchedular(id) {
    this.isSchedularEdit = true;
    this.createView = true;
    this.listView = false;
    if (id) {
      const url = "/schedulers/getScheduler/" + id;
      this.service.getMethod(url).subscribe(
        (response: any) => {
          this.viewSchedularDate = response.data;
          this.schedularId = response?.data?.id;
          this.schedularForm.patchValue(this.viewSchedularDate);
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

  deleteSchedularConfirmation(scheduler) {
    if (scheduler) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.title + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteSchedular(scheduler);
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
  }
  clearsearch() {
    // this.knowledgebaseName = "";
    this.searchkey = "";
    this.search = "";
    // if (this.searchkey) {
    //   this.searchKnowledgeBase();
    // } else {
    //   this.getKnowledgeBaseList("");
    // }
    this.getAllSchedularList("");
    this.submitted = false;
    this.isSchedularEdit = false;
    this.schedularForm.reset();
    this.schedularForm.patchValue({ mvnoId: this.mvnoId });
  }

  deleteSchedular(scheduler) {
    const url = "/schedulers/delete/" + scheduler?.id;
    this.service.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && this.schedularList.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (
          response.responseCode == 405 ||
          response.responseCode == 406 ||
          response.responseCode == 417
        ) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
        }
        this.clearsearch();
        // if (this.searchkey) {
        //   this.searchKnowledgeBase();
        // } else {
        //   this.getKnowledgeBaseList("");
        // }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.responseMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  formatSchedularForm(date: Date): string {
    if (!date || isNaN(date.getTime())) return "";
    const timePart = this.datePipe.transform(date, "HH:mm");
    return timePart || "";
  }

  sendToKafka(id: any) {
    //this.spinner.show();
    // this.deviceDriversService.sendDD(id).subscribe(
    //   (res: any) => {
    //     if (res.statusCode != 200) {
    //       this.messageService.add({
    //         severity: "info",
    //         summary: "info",
    //         detail: res.message,
    //         icon: "far fa-check-circle"
    //       });
    //     } else {
    //       setTimeout(async () => {
    //         await this.getAllDeviceDrivers(this.currentPage, this.itemsPerPage);
    //         this.messageService.add({
    //           severity: "success",
    //           summary: "Success",
    //           detail: "Collector Started Successfully",
    //           icon: "far fa-check-circle"
    //         });
    //         //this.spinner.hide();
    //       }, 4000);
    //     }
    //   },
    //   error => {
    //     if (error.status == 406) {
    //       this.messageService.add({
    //         severity: "info",
    //         summary: "info",
    //         detail: error.error.message,
    //         icon: "far fa-times-circle"
    //       });
    //     } else {
    //       this.messageService.add({
    //         severity: "error",
    //         summary: error.message,
    //         detail: "Something went wrong",
    //         icon: "far fa-times-circle"
    //       });
    //     }
    //     //this.spinner.hide();
    //   }
    // );
  }
  stopDeviceDriver(id: any) {
    //this.spinner.show();
    // this.deviceDriversService.stopDD(id).subscribe(
    //   (res: any) => {
    //     if (res.statusCode != 200) {
    //       this.messageService.add({
    //         severity: "info",
    //         summary: "info",
    //         detail: res.message,
    //         icon: "far fa-check-circle"
    //       });
    //     } else {
    //       let driver = this.deviceDriversList.find(d => d.db_id === id);
    //       if (driver) {
    //         driver.activeStatus = "Inactive";
    //       }
    //       setTimeout(async () => {
    //         await this.getAllDeviceDrivers(this.currentPage, this.itemsPerPage);
    //         this.messageService.add({
    //           severity: "success",
    //           summary: "Success",
    //           detail: "Collector Stopped Successfully",
    //           icon: "far fa-check-circle"
    //         });
    //       }, 4000);
    //     }
    //   },
    //   error => {
    //     this.messageService.add({
    //       severity: "error",
    //       summary: error.message,
    //       detail: "Something went wrong",
    //       icon: "far fa-times-circle"
    //     });
    //     //this.spinner.hide();
    //   }
    // );
  }
}
