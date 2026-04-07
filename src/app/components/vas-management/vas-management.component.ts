import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Observable, Observer } from "rxjs";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { VasManagementService } from "src/app/service/vas-management.service";
@Component({
  selector: "app-vas-management",
  templateUrl: "./vas-management.component.html",
  styleUrls: ["./vas-management.component.css"]
})
export class VasManagementComponent implements OnInit {
  vasGroupForm: FormGroup;
  vasCategoryList: any;
  submitted: boolean = false;
  taxListData: any = [];
  createVasData: any;
  currentPageVasListdata = 1;
  vasListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  vasListdatatotalRecords: any;
  vasListData: any = [];
  viewVASListData: any = [];
  isVasEdit: boolean = false;
  detailView: boolean = false;
  listView: boolean = true;
  createView: boolean = false;
  searchdataview: boolean = false;
  searchData: any = [];
  chargetype = "";
  chargecategory = "";
  chargename = "";
  searchOption: "";
  chargeOptionname: "";
  charge: any = {};
  statusOptions = RadiusConstants.status;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: any = [];
  totalDataListLength = 0;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  chargeTypeText: any;
  currency: string;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  isChargeName = false;
  isChargeCatogorey = false;
  isChargeType = false;
  chargeTypeGetDataData: any[];
  chargeType: any;
  searchVASName: any;
  tatListData: any;
  chargefromgroup: FormGroup;
  pricePerTax: any = 0;
  advanceListData: any = [];
  chargeSubmitted: boolean = false;
  countTotalOfferPrice = 0;
  totalPriceData = [];
  chargeFromArray: FormArray;
  validityUnit = [{ label: "Hours" }, { label: "Days" }, { label: "Months" }, { label: "Years" }];
  chargeIdFromService: any;
  taxDetails: any = [];
  vasPlan: any;
  openVasDetailsByCust: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private vasManagementService: VasManagementService,
    public commondropdownService: CommondropdownService,
    loginService: LoginService,
    private systemService: SystemconfigService
  ) {
    this.createAccess = loginService.hasPermission(PRODUCTS.CHARGE_CREATE);
    this.deleteAccess = loginService.hasPermission(PRODUCTS.CHARGE_DELETE);
    this.editAccess = loginService.hasPermission(PRODUCTS.CHARGE_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
  }

  ngOnInit(): void {
    this.vasGroupForm = this.fb.group({
      name: ["", Validators.required],
      pauseDaysLimit: ["", Validators.required],
      pauseTimeLimit: ["", Validators.required],
      tatId: ["", Validators.required],
      inventoryReplaceAfterYears: ["", Validators.required], //IT will treat as month now on
      inventoryPaidMonths: ["", Validators.required],
      inventoryCount: ["", Validators.required],
      shiftLocationYears: ["", Validators.required],
      shiftLocationMonths: ["", Validators.required],
      shiftLocationCount: ["", Validators.required],
      vasAmount: ["", Validators.required],
      validity: [""],
      unitsOfValidity: ["Days", Validators.required],
      isdefault: [false],
      chargeList: this.fb.array([]),
      currency: [""]
    });
    this.chargefromgroup = this.fb.group({
      chargeId: [""],
      actualprice: [""],
      taxamount: [""],
      chargeprice: [""],
      price: [""],
      currency: [""]
    });

    this.charge = {
      id: "",
      taxamount: "",
      actualprice: "",
      price: ""
    };

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

    this.getVASList("");
    this.searchOption = "";
    this.chargeFromArray = this.fb.array([]);
    this.chargeFromArray.clear();

    this.selchargeOption({ value: "any" });
    this.getTATList();
    this.getChargeForCustomer();
  }

  createVAS() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.searchdataview = false;
    this.submitted = false;
    this.isVasEdit = false;
    this.viewVASListData = [];
    this.vasGroupForm.reset();
    this.vasGroupForm.get("isdefault").setValue(false);
    this.chargeFromArray.clear();
    this.totalPriceData = [];
    this.countTotalOfferPrice = 0;
    this.pricePerTax = 0;
  }

  searchVasdata() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.searchdataview = true;
  }

  listCharge() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.searchdataview = false;
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageVasListdata > 1) {
      this.currentPageVasListdata = 1;
    }
    if (!this.searchkey) {
      this.getVASList(this.showItemPerPage);
    } else {
      this.searchVAS();
    }
  }

  getVASList(list) {
    let mvnoId = localStorage.getItem("mvnoId");
    const url = "/vasplans/findall?mvnoId=" + mvnoId;
    let size;
    this.searchkey = "";
    let page_list = this.currentPageVasListdata;
    if (list) {
      size = list;
      this.vasListdataitemsPerPage = list;
    } else {
      size = this.vasListdataitemsPerPage;
    }
    let vatdata = {
      page: page_list,
      pageSize: size
    };
    this.vasManagementService.postMethod(url, vatdata).subscribe(
      (response: any) => {
        this.vasListData = response.dataList;
        this.vasListdatatotalRecords = response.totalRecords;
        this.searchkey = "";
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

  addEditVAS(vatId) {
    this.submitted = true;
    if (this.vasGroupForm.valid) {
      const formData = this.vasGroupForm.value;
      formData.vasAmount = Number(formData.vasAmount);
      const chargeList = this.chargeFromArray.value.map((row: any) => {
        return {
          chargeId: row.chargeId,
          createDate: row.createDate
            ? new Date(row.createDate).toISOString()
            : new Date().toISOString(),
          chargePrice: +(row.chargeprice || row.price || row.actualprice || 0)
        };
      });
      const createVasData = {
        ...formData,
        code: "",
        chargeList: chargeList
      };
      if (vatId) {
        const mvnoId = this.viewVASListData?.mvnoId
          ? this.viewVASListData.mvnoId
          : localStorage.getItem("mvnoId");
        createVasData.mvnoId = mvnoId;
        const url = "/update/" + vatId;
        this.vasManagementService.updateMethod(url, createVasData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.vasGroupForm.reset();
            this.isVasEdit = false;
            this.viewVASListData = [];
            this.listView = true;
            this.createView = false;
            if (!this.searchkey) {
              this.getVASList("");
            } else {
              this.searchVAS();
            }
            this.messageService.add({
              severity: "success",
              summary: " ",
              detail: response.msg,
              icon: "far fa-check-circle"
            });
          },
          (error: any) => {
            // console.log(error, 'error')
            if (error.error.status == 417 || error.error.status == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            }
          }
        );
      } else {
        let mvnoId = localStorage.getItem("mvnoId");
        createVasData.mvnoId = mvnoId;
        const url = "/vasplan";
        this.vasManagementService.postMethod(url, createVasData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.vasGroupForm.reset();
            this.listView = true;
            this.createView = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            if (!this.searchkey) {
              this.getVASList("");
            } else {
              this.searchVAS();
            }
          },
          (error: any) => {
            // console.log(error, 'error')
            if (error.error.status == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            }
          }
        );
      }
    }
  }

  async vasCharge(vatId) {
    this.listView = false;
    this.createView = true;
    this.searchdataview = false;
    this.vasGroupForm.reset();
    this.viewVASListData = [];
    this.getChargeForCustomer();

    if (vatId) {
      let mvnoId = localStorage.getItem("mvnoId");
      const url = "/vasplan/" + vatId + "?mvnoId=" + mvnoId;
      this.vasManagementService.getMethod(url).subscribe(
        async (response: any) => {
          this.isVasEdit = true;
          this.viewVASListData = response.VasPlanData;

          // Reset data
          this.chargeFromArray.clear();
          this.totalPriceData = [];
          this.countTotalOfferPrice = 0;

          const chargeList = this.viewVASListData.chargeList;

          // Loop through existing charges
          for (let i = 0; i < chargeList.length; i++) {
            const element = chargeList[i];

            // Step 1: Push raw data first
            const rowForm = this.fb.group({
              id: [element.id],
              chargeId: [element.chargeId],
              taxamount: [0],
              actualprice: [0],
              price: [0],
              chargeprice: [element.chargePrice],
              currency: [""]
            });

            this.chargeFromArray.push(rowForm);
            this.totalPriceData.push(0); // placeholder

            // Step 2: Simulate offer price fetch (just like add flow)
            const url = `/charge/${element.chargeId}` + "?mvnoId=" + mvnoId;
            await new Promise((resolve, reject) => {
              this.vasManagementService.getMethod(url).subscribe(
                (res: any) => {
                  //   resolve(true);
                  const chargeData = res.chargebyid;
                  const actualprice = chargeData.actualprice;
                  const taxid = chargeData.taxid;
                  const currency = chargeData.currency;

                  const rowForm = this.chargeFromArray.at(i);
                  rowForm.patchValue({
                    actualprice: actualprice,
                    chargeprice: actualprice,
                    currency: currency
                  });

                  // Trigger tax and price calc (edit mode)
                  if (taxid) {
                    this.getamountPerTaxCount(taxid, actualprice, i, true);
                  }

                  // Optional: set currency globally
                  if (i === 0) {
                    this.vasGroupForm.controls.currency?.setValue(currency);
                  }

                  resolve(true);
                },
                (error: any) => {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: error.error.ERROR,
                    icon: "far fa-times-circle"
                  });
                  reject();
                }
              );
            });
          }

          // Patch top-level form data (except vasAmount, already patched above)
          this.vasGroupForm.patchValue({
            ...this.viewVASListData,
            vasAmount: this.countTotalOfferPrice.toFixed(2)
          });

          this.chargeSubmitted = false;
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
  }

  canExit() {
    if (!this.vasGroupForm.dirty) return true;
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

  deleteConfirmonCharge(vatId: number) {
    if (vatId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Charge?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteVAT(vatId);
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

  deleteVAT(vatId) {
    const url = "/vasplan/" + vatId;
    this.vasManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageVasListdata != 1 && this.totalDataListLength == 1) {
          this.currentPageVasListdata = this.currentPageVasListdata - 1;
        }
        if (response.responseCode == 405) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
        this.commondropdownService.clearCacheCMS("/charge/all");
        if (!this.searchkey) {
          this.getVASList("");
        } else {
          this.searchVAS();
        }
      },
      (error: any) => {
        if (error.error.responseCode == 405 || error.error.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  selchargeOption(event) {
    let selOption = event.value;
    if (selOption == "name") {
      this.isChargeName = true;
      this.isChargeCatogorey = false;
      this.isChargeType = false;
      this.chargeOptionname = "";
    } else if (selOption == "chargecategory") {
      this.isChargeName = false;
      this.isChargeCatogorey = true;
      this.isChargeType = false;
      this.chargeOptionname = "";
    } else if (selOption == "chargetype") {
      this.isChargeName = false;
      this.isChargeCatogorey = false;
      this.isChargeType = true;
      this.chargeOptionname = "";
    } else if (selOption == "any") {
      this.isChargeName = true;
      this.isChargeCatogorey = false;
      this.isChargeType = false;
      this.chargeOptionname = "";
    } else {
      this.isChargeName = false;
      this.isChargeCatogorey = false;
      this.isChargeType = false;
      this.chargeOptionname = "";
    }
  }

  searchVAS() {
    if (!this.searchkey || this.searchkey !== this.searchVASName) {
      this.currentPageVasListdata = 1;
    }
    this.searchkey = this.searchVASName;
    if (this.showItemPerPage) {
      this.vasListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchVASName.trim();
    this.searchData.page = this.currentPageVasListdata;
    this.searchData.pageSize = this.vasListdataitemsPerPage;

    const url = "/vasPlan/search";
    // console.log("this.searchData", this.searchData)
    this.vasManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.vasListData = response.vasPlanList;
        this.vasListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.vasListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.vasListData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.response.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }
  pageChangedChargeList(pageNumber) {
    this.currentPageVasListdata = pageNumber;
    if (!this.searchkey) {
      this.getVASList("");
    } else {
      this.searchVAS();
    }
  }

  clearVAS() {
    this.searchVASName = "";
    this.searchkey = "";
    this.getVASList("");
    this.submitted = false;
    this.vasGroupForm.reset();
  }

  getTATList() {
    const url = "/tickettatmatrix/searchByStatus";
    this.vasManagementService.getMethodTAT(url).subscribe(
      (response: any) => {
        this.tatListData = response.dataList;
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

  getamountPerTaxCount(id, price, rowIndex?: number, updateRowDirectly?: boolean) {
    let taxData: any = [];
    let slabList: any = [];
    let tireList: any = [];
    let slabPrice: any = [];
    let amount = 0;
    let totalslebPrice = 0;

    const url = "/taxes/" + id;
    this.vasManagementService.getMethod(url).subscribe(
      (response: any) => {
        taxData = response.taxData;

        if (taxData.taxtype === "SLAB") {
          slabList = taxData.slabList;
          if (slabList.length > 0) {
            for (let i = 0; i < slabList.length; i++) {
              if (price >= slabList[i].rangeUpTo) {
                if (i === 0) {
                  amount = slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                  price = price - slabList[i].rangeUpTo;
                } else {
                  const NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                  amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                  price = price - NewAmount;
                }
                slabPrice.push(amount);

                if (slabList.length === i + 1) {
                  slabPrice.forEach(element => {
                    totalslebPrice += Number(element);
                  });
                  this.pricePerTax = totalslebPrice.toFixed(2);
                }
              } else {
                amount = price + (price * slabList[i].rate) / 100;
                slabPrice.push(amount);
                slabPrice.forEach(element => {
                  totalslebPrice += Number(element);
                });
                this.pricePerTax = totalslebPrice.toFixed(2);
                break;
              }
            }
          }
        } else if (taxData.taxtype === "TIER") {
          let ifsameTire = false;
          tireList = taxData.tieredList;
          if (tireList.length > 0) {
            let newAmount = 0;
            let totalAmountTire = 0;
            let totalPricetire = 0;
            let tireAmountList = [];

            amount = price + (price * tireList[0].rate) / 100;
            newAmount = (price * tireList[0].rate) / 100;
            totalAmountTire = amount;

            if (tireList.length === 1) {
              this.pricePerTax = amount.toFixed(2);
            } else {
              for (let i = 1; i < tireList.length; i++) {
                let AcTiNo = i;
                while (AcTiNo > 0) {
                  const TI_NO = AcTiNo - 1;
                  if (tireList[i].taxGroup === tireList[TI_NO].taxGroup) {
                    ifsameTire = true;
                    AcTiNo = 0;
                  } else {
                    amount = newAmount;
                    ifsameTire = false;
                  }
                  AcTiNo--;
                }

                if (ifsameTire) {
                  amount += (price * tireList[i].rate) / 100;

                  if (tireList.length === i + 1 || amount < 0) {
                    tireAmountList.forEach(element => {
                      totalPricetire += Number(element);
                    });
                    totalAmountTire = amount;
                    this.pricePerTax = totalAmountTire.toFixed(2);
                    break;
                  }
                } else {
                  amount = (amount * tireList[i].rate) / 100;
                  tireAmountList.push(amount.toFixed(2));

                  if (tireList.length === i + 1 || amount < 0) {
                    tireAmountList.forEach(element => {
                      totalPricetire += Number(element);
                    });

                    totalAmountTire += totalPricetire;
                    this.pricePerTax = totalAmountTire.toFixed(2);
                    break;
                  }
                }
              }
            }
          }
        } else if (taxData.taxtype === "Compound") {
          let finalAmount = price;
          taxData.tieredList.forEach(tax => {
            finalAmount += finalAmount * (tax.rate / 100);
          });
          this.pricePerTax = finalAmount.toFixed(2);
        }

        // ✅ Patch either chargefromgroup (add) or specific row (edit)
        const basePrice = parseFloat(price);
        const totalPriceWithTax = parseFloat(this.pricePerTax);
        const taxAmount = (totalPriceWithTax - basePrice).toFixed(2);

        if (typeof rowIndex === "number" && updateRowDirectly) {
          // ✅ Edit flow: update specific row in chargeFromArray
          const row = this.chargeFromArray.at(rowIndex);
          row.patchValue({
            taxamount: taxAmount,
            price: totalPriceWithTax.toFixed(2)
          });

          this.totalPriceData[rowIndex] = totalPriceWithTax;
          this.countTotalOfferPrice = this.totalPriceData.reduce(
            (sum, val) => sum + Number(val),
            0
          );
          this.vasGroupForm.patchValue({
            vasAmount: this.countTotalOfferPrice.toFixed(2)
          });
        } else {
          // ✅ Add flow: update chargefromgroup
          this.chargefromgroup.patchValue({
            taxamount: taxAmount,
            price: totalPriceWithTax.toFixed(2)
          });
          if (!updateRowDirectly && !this.chargefromgroup.get("price")?.value) {
            this.totalPriceData.push(totalPriceWithTax);
          }

          this.countTotalOfferPrice = this.totalPriceData.reduce(
            (sum, val) => sum + Number(val),
            0
          );
          this.vasGroupForm.patchValue({
            vasAmount: this.countTotalOfferPrice.toFixed(2)
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

  createChargeFormGroup(): FormGroup {
    for (const prop in this.chargefromgroup.controls) {
      this.chargefromgroup.value[prop] = this.chargefromgroup.controls[prop].value;
    }

    return this.fb.group({
      chargeId: [this.chargefromgroup.value.chargeId],
      actualprice: [this.chargefromgroup.value.actualprice],
      taxamount: [this.chargefromgroup.value.taxamount],
      chargeprice: [this.chargefromgroup.value.chargeprice],
      price: [this.chargefromgroup.value.price],
      currency: [this.chargefromgroup.value.currency]
    });
  }

  onAddChargeField() {
    this.chargeSubmitted = true;
    if (this.chargefromgroup.valid) {
      this.countTotalOfferPrice = 0;
      this.totalPriceData.push(Number(this.pricePerTax));
      for (let j = 0; j < this.totalPriceData.length; j++) {
        this.countTotalOfferPrice = this.countTotalOfferPrice + Number(this.totalPriceData[j]);
      }
      this.vasGroupForm.patchValue({
        vasAmount: this.countTotalOfferPrice.toFixed(2)
      });
      this.filterChargesByCurrency(this.chargefromgroup.value);
      this.chargeFromArray.push(this.createChargeFormGroup());
      this.chargefromgroup.reset();
      this.getChargeForCustomer();
      if (this.chargeFromArray?.length > 0) {
        this.vasGroupForm.controls?.currency.setValue(this.chargeFromArray?.value[0]?.currency);
      }
      this.chargeSubmitted = false;
    } else {
    }
  }

  preventNegative(event: KeyboardEvent): void {
    const invalidKeys = ["-", "+", "e", "E"];
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (invalidKeys.includes(event.key) || isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  getChargeForCustomer() {
    let mvnoId = localStorage.getItem("mvnoId");
    const url = "/getAllbychargetype?mvnoId=" + mvnoId;
    this.vasManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.chargeType = response.dataList;
        // console.log("ChargeForCustomerData", this.ChargeForCustomerData);
      },
      (error: any) => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: error.error.ERROR,
        //   icon: 'far fa-times-circle',
        // })
      }
    );
  }
  getofferPrice(event) {
    let chargeId = event.value;
    let price = "";
    let mvnoId = localStorage.getItem("mvnoId");
    const url = "/charge/" + chargeId + "?mvnoId=" + mvnoId;
    this.vasManagementService.getMethod(url).subscribe(
      (response: any) => {
        price = response.chargebyid.price;
        this.chargefromgroup.patchValue({
          actualprice: response.chargebyid.actualprice,
          taxamount: response.chargebyid.taxamount,
          chargeprice: response.chargebyid.actualprice,
          price: response.chargebyid.price,
          currency: response.chargebyid.currency
        });
        if (response.chargebyid.taxid) {
          this.getamountPerTaxCount(response.chargebyid.taxid, price, null, false);
        }
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

  deleteConfirmonChargeField(chargeFieldIndex: number, chargeFieldId: number) {
    if (chargeFieldIndex || chargeFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this charge?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveCharge(chargeFieldIndex, chargeFieldId);
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

  async onRemoveCharge(chargeFieldIndex: number, chargeFieldId: number) {
    let totalPrice = 0;
    this.chargeFromArray.removeAt(chargeFieldIndex);
    if (this.chargeFromArray?.length <= 0) {
      this.chargeFilterData(chargeFieldId);
    }
    totalPrice = this.vasGroupForm.value.vasAmount - this.totalPriceData[chargeFieldIndex];
    this.countTotalOfferPrice = totalPrice;
    this.vasGroupForm.patchValue({
      vasAmount: totalPrice.toFixed(2)
    });
    this.totalPriceData.splice(chargeFieldIndex, 1);
    this.getChargeForCustomer();
  }

  chargeFilterData(id) {
    this.chargeType = [];
    let ListData: any = [];
    const url1 = "/charge2/" + id + "?service=" + id + "&mvnoId=" + localStorage.getItem("mvnoId");
    this.vasManagementService.getMethod(url1).subscribe((response: any) => {
      ListData = response.dataList;
      ListData.forEach(element => {
        this.advanceListData.push(element.charge);
        this.filterChargeType();
      });
    });
  }

  filterChargesByCurrency(charge) {
    const selectedCurrency = charge?.currency;

    this.chargeType = this.chargeType.filter(charge => {
      const chargeCurrency = charge?.currency ?? this.currency;
      return chargeCurrency === selectedCurrency;
    });

    this.filterChargeType();
  }

  filterChargeType() {
    this.chargeType = this.chargeType.filter(charge => charge.chargetype === "NON_RECURRING"); //chargetype must be changed.
  }

  closedialog() {
    this.openVasDetailsByCust = false;
  }

  openVasDetails(vasData) {
    this.openVasDetailsByCust = true;
    this.vasPlan = vasData;
  }

  changeActualPrice(price, id, index, actualprice, event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    if (Number(inputElement.value) > 0) {
      let taxData: any = [];
      let slabList: any = [];
      let tireList: any = [];
      let slabPrice: any = [];
      let amount = 0;
      let totalslebPrice = 0;
      let noTaxPrice = 0;
      const url1 = "/charge/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.vasManagementService.getMethod(url1).subscribe((res: any) => {
        let url = "/taxes/" + res.chargebyid.taxid;
        this.vasManagementService.getMethod(url).subscribe((response: any) => {
          taxData = response.taxData;
          if (taxData.taxtype == "SLAB") {
            slabList = taxData.slabList;
            if (slabList.length > 0) {
              for (let i = 0; i < slabList.length; i++) {
                if (price >= slabList[i].rangeUpTo) {
                  if (i == 0) {
                    amount =
                      slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                    price = price - slabList[i].rangeUpTo;
                  } else {
                    let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                    amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                    price = price - NewAmount;
                  }
                  slabPrice.push(amount);

                  if (slabList.length == i + 1) {
                    slabPrice.forEach(element => {
                      totalslebPrice = totalslebPrice + Number(element);
                    });
                    this.pricePerTax = totalslebPrice.toFixed(2);
                  }
                } else {
                  amount = price + (price * slabList[i].rate) / 100;
                  slabPrice.push(amount);
                  slabPrice.forEach(element => {
                    totalslebPrice = totalslebPrice + Number(element);
                  });
                  this.pricePerTax = totalslebPrice.toFixed(2);
                  slabList.length = 0;
                }
              }
            }
          } else if (taxData.taxtype == "TIER") {
            let ifsameTire = false;
            if (taxData.tieredList.length > 0) {
              tireList = taxData.tieredList;
              if (tireList.length > 0) {
                let newAmount = 0;
                let totalAmountTire = 0;
                let totalPricetire = 0;
                let tireAmountList = [];

                amount = price + (price * tireList[0].rate) / 100;
                newAmount = (price * tireList[0].rate) / 100;
                totalAmountTire = amount;
                if (tireList.length == 1) {
                  this.taxAmountCal(price, tireList[0].rate);
                  this.pricePerTax = Number(amount).toFixed(2);
                  this.totalPriceData.forEach((element, j) => {
                    if (j == index) {
                      this.totalPriceData[j] = this.pricePerTax;
                      let count: number = 0;
                      for (let j = 0; j < this.totalPriceData.length; j++) {
                        let n = this.totalPriceData[j];
                        count = Number(count) + Number(n);
                        this.countTotalOfferPrice = Number(count.toFixed(2));
                      }
                      this.chargeFromArray.value.forEach((elem, indexCharge) => {
                        let nn = indexCharge + 1;
                        if (indexCharge == index) {
                          elem.taxamount = this.taxAmount.toFixed(2);
                        }
                        if (this.chargeFromArray.value.length == nn) {
                          this.chargeFromArray.patchValue(this.chargeFromArray.value);
                        }
                      });
                      this.vasGroupForm.patchValue({
                        vasAmount: count.toFixed(2)
                      });
                    }
                  });
                } else {
                  for (let i = 1; i < tireList.length; i++) {
                    let AcTiNo = i;
                    while (AcTiNo > 0) {
                      let TI_NO = AcTiNo - 1;
                      if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                        ifsameTire = true;
                        AcTiNo = 0;
                      } else {
                        amount = newAmount;
                        ifsameTire = false;
                      }
                      AcTiNo--;
                    }

                    if (ifsameTire) {
                      amount = amount + (amount * tireList[i].rate) / 100;
                      if (tireList.length == i + 1 || amount < 0) {
                        tireAmountList.forEach(element => {
                          totalPricetire = totalPricetire + Number(element);
                        });

                        totalAmountTire = amount;
                        this.pricePerTax = totalAmountTire.toFixed(2);
                        this.totalPriceData.forEach((element, j) => {
                          if (j == index) {
                            this.totalPriceData[j] = this.pricePerTax;
                            let count = 0;
                            for (let j = 0; j < this.totalPriceData.length; j++) {
                              let n = this.totalPriceData[j];
                              count = Number(count) + Number(n);
                              this.countTotalOfferPrice = Number(count.toFixed(2));
                            }

                            this.chargeFromArray.value.forEach((elem, indexCharge) => {
                              let nn = indexCharge + 1;
                              if (indexCharge == index) {
                                elem.taxamount = (Number(this.pricePerTax) - Number(price)).toFixed(
                                  2
                                );
                              }
                              if (this.chargeFromArray.value.length == nn) {
                                this.chargeFromArray.patchValue(this.chargeFromArray.value);
                              }
                            });
                            this.vasGroupForm.patchValue({
                              vasAmount: count.toFixed(2)
                            });
                          }
                        });
                        tireList.length = 0;
                      }
                    } else {
                      amount = (amount * tireList[i].rate) / 100;
                      tireAmountList.push(amount.toFixed(2));

                      if (tireList.length == i + 1 || amount < 0) {
                        tireAmountList.forEach(element => {
                          totalPricetire = totalPricetire + Number(element);
                        });

                        totalAmountTire = totalAmountTire + totalPricetire;
                        this.pricePerTax = totalAmountTire.toFixed(2);

                        this.totalPriceData.forEach((element, j) => {
                          if (j == index) {
                            this.totalPriceData[j] = this.pricePerTax;
                            let count = 0;
                            for (let j = 0; j < this.totalPriceData.length; j++) {
                              let n = this.totalPriceData[j];
                              count = Number(count) + Number(n);
                              this.countTotalOfferPrice = Number(count.toFixed(2));
                            }

                            this.chargeFromArray.value.forEach((elem, indexCharge) => {
                              let nn = indexCharge + 1;
                              if (indexCharge == index) {
                                elem.taxamount = Number(this.pricePerTax) - Number(price);
                                elem.taxamount = elem.taxamount.toFixed(2);
                              }
                              if (this.chargeFromArray.value.length == nn) {
                                this.chargeFromArray.patchValue(this.chargeFromArray.value);
                              }
                            });
                            this.vasGroupForm.patchValue({
                              vasAmount: count.toFixed(2)
                            });
                          }
                        });
                        tireList.length = 0;
                      }
                    }
                  }
                }
              }
            }
          } else if (taxData.taxtype == "Compound") {
            let finalAmount = price;

            // Apply each tax tier
            taxData.tieredList.forEach(tax => {
              finalAmount += finalAmount * (tax.rate / 100);
            });
            this.pricePerTax = finalAmount;
            this.totalPriceData.forEach((element, j) => {
              if (j == index) {
                this.totalPriceData[j] = this.pricePerTax;
                let count = 0;
                for (let j = 0; j < this.totalPriceData.length; j++) {
                  let n = this.totalPriceData[j];
                  count = Number(count) + Number(n);
                  this.countTotalOfferPrice = Number(count.toFixed(2));
                }

                this.chargeFromArray.value.forEach((elem, indexCharge) => {
                  let nn = indexCharge + 1;
                  if (indexCharge == index) {
                    elem.taxamount = Number(this.pricePerTax) - Number(price);
                    elem.taxamount = elem.taxamount.toFixed(2);
                  }
                  if (this.chargeFromArray.value.length == nn) {
                    this.chargeFromArray.patchValue(this.chargeFromArray.value);
                  }
                });
                this.vasGroupForm.patchValue({
                  vasAmount: count.toFixed(2)
                });
              }
            });
          }
        });
      });
      return true;
    } else {
      return;
    }
  }

  taxAmount: any;
  taxAmountCal(price, rate) {
    this.taxAmount = (price * rate) / 100;
    return this.taxAmount.toFixed(2);
  }

  preventNegativeInput(event: KeyboardEvent) {
    if (event.key === "-") {
      event.preventDefault();
    }
  }

  blockNegative(event: KeyboardEvent) {
    if (event.key === "-" || event.key === "e" || event.key === "E") {
      event.preventDefault();
    }
  }
}
