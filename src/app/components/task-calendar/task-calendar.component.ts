import { DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ConfirmationService, MessageService } from "primeng/api";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { TeamsService } from "../teams/teams.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerService } from "src/app/service/customer.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { TicketManagementService } from "src/app/service/ticket-management.service";
import { TaskManagementService } from "src/app/service/task-management.service";
import { interval, Subscription } from "rxjs";
import { Router } from "@angular/router";
import * as moment from "moment";
import { LoginService } from "src/app/service/login.service";
import { TECHNICIAN_DIARY_SYSTEMS } from "src/app/constants/aclConstants";
@Component({
  selector: "app-task-calendar-create",
  templateUrl: "./task-calendar.component.html",
  styleUrls: ["./task-calendar.component.css"],
  providers: [DatePipe]
})
export class TaskCalendarComponent implements OnInit {
  @ViewChild("calendar") calendarComponent: FullCalendarComponent;
  showEventDate: boolean;
  eventDataList: any[] = [];
  showCalendar = true;
  groupedEvents: any[] = [];
  assignStaffData: any;
  assignStaffParentId: any;
  displayDialog: boolean = false;
  isUpdateMode: boolean = false;
  //   selectedEventId: string = "";
  selectedEventId: any;
  teamListData: any[] = [];
  staffDataList: any = [];
  parentCustList: any;
  customerDetailData: any;
  displaySelectCustomer: boolean = false;
  newFirst = 0;
  selectedParentCust: any = [];
  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerList = [];
  parentCustomerListdatatotalRecords: any;
  searchParentCustOption = "";
  searchParentCustValue = "";
  parentFieldEnable = false;
  ticketReasonSubCategoryData: any;
  customerServiceData: any;
  ticketDataForDomain: any;
  assignTicketStatus: any = "";
  showChangeProblemDomain: boolean = false;
  submitted = false;
  ticketReasonCategoryData: any;
  searchkey: string;
  showData: boolean = false;
  ticketConfigitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage = 0;
  ticketRemainTimeSubscription: Subscription;
  obs$ = interval(1000);

  currentPageTicketConfig = 1;
  ticketConfigtotalRecords: number;
  totalDataListLength = 0;
  ticketData: any[] = [];

  showStatus: boolean = true;
  showServices: boolean = true;
  viewTicket: boolean = true;
  createTicket = false;
  detailTicket = false;
  searchSubmitted = false;
  isTicketEdit = false;
  selectedFilePreview: File[] = [];
  searchservicearea_id: any;
  searchcaseStatus: any;
  searchticketReasonCategoryId: any;
  mvnoid: any;
  TATDetails: any = [];
  parentTRCData: any;
  caseTypeData: any;
  UnpickTicketDetails: any = [];
  isTicketChecked: boolean = false;
  chakedTicketData = [];

  AssignToMeTicketDetails: any = [];
  isTicketCheckedAssigntome: boolean = false;
  createStatusList: any = [];
  chnageStatusForm: FormGroup;
  statusData: any;
  ChangestatusList: any = [];
  viewTicketData: any = {};
  currentLoginUserId: any;

  changeStatusSingleMultiple = "";

  isCall: boolean = false;
  isticket: boolean = false;
  isCallDisconnected: boolean = false;
  isAgendaPaneOpen: boolean = false;
  selectedEvent: any = null;
  selectedEvents: any[] = [];
  loginUserName: string | null = "";

  createTicketData: any = {
    // selectedEventId: null,
    caseCategoryId: null,
    isFromCalender: true,
    startDate: "",
    endDate: "",
    caseForPartner: "",
    caseFor: "",
    caseOrigin: "",
    // ------------
    call_status: null,
    caseReason: null,
    // caseReasonCategory: null,
    // caseReasonSubCategory: null,
    deacivate_reason: null,
    department: "Sales",
    is_closed: null,
    mvnoId: 2,
    rootCauseReasonId: 0,
    source: null,
    subSource: null,
    ticketAssignStaffMappings: [],
    caseDocDetails: [],
    caseType: null,
    // ---------------------------
    caseReasonSubCategory: null,
    caseStatus: null,
    currentAssignee: null,
    currentAssigneeId: null,
    file: null,
    groupReasonId: null,
    helperName: null,
    nextFollowupDate: null,
    nextFollowupTime: null,
    priority: null,
    caseReasonCategory: null,
    caseTitle: null

    // ticketServicemappingList: [{ serviceid: "", ticketid: "" }]
  };

  updateTicketData = {
    isFromCalender: true,
    startDate: "",
    endDate: "",
    ticketId: "",
    status: "",
    caseType: "",
    assignee: "",
    priority: "",
    attachment: "",
    filename: "",
    // finalResolutionId: "",
    remarkType: "",
    remark: "",
    groupReasonId: "",
    caseCategoryId: "",
    // ticketReasonCategoryId: "",
    caseTitle: "",
    rootCauseReasonId: "",
    source: "",
    subSource: "",
    // customerAdditionalMobileNumber: "",
    // customerAdditionalEmail: "",
    helperName: "",
    nextFollowupDate: "",
    nextFollowupTime: "",
    serialNumber: "",
    mvnoId: 2,
    tatMappingId: null,
    teamHierarchyMappingId: null,
    case_order: 0,
    caseSlaTime: 0,
    caseSlaUnit: "",
    teamId: 0,
    finalTaskCompletionRemark: null,
    createby: "",
    updateby: "",
    currentAssigneeId: ""
  };
  deletedata: any = {
    CaseId: "",
    caseForPartner: "",
    caseOrigin: "",
    caseReasonId: "",
    caseTitle: "",
    caseType: "",
    customersId: "",
    nextFollowupDate: "",
    nextFollowupTime: "",
    oltName: "",
    portName: "",
    priority: "",
    serviceAreaName: "",
    email: "",
    mobile: "",
    slotName: "",
    userName: "",
    caseStatus: "",
    currentAssignee: "",
    currentAssigneeId: ""
  };
  ticketDeatailData: any = {
    caseTitle: "",
    customerName: "",
    userName: "",
    serviceAreaName: "",
    oltName: "",
    slotName: "",
    portName: "",
    caseType: "",
    caseReasonId: "",
    priority: "",
    nextFollowupDate: "",
    nextFollowupTime: "",
    caseStatus: ""
  };
  savedCustomerDetails: any;
  displaySavedCustomerDialog: boolean = false;
  selectedDuration: string = "allDay";
  viewMode: string = "";
  dayWiseEvents: any = {};
  today = new Date();
  eventDurationOptions = [
    { label: "All Day", value: "allDay" },
    { label: "Flexible", value: "flexible" }
    // { label: "Monthly", value: "month" }
  ];
  calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

    customButtons: {
      //   myCustomButton: {
      //     text: "Add Event",
      //     click: () => {
      //       this.openEventDialog();
      //     }
      //   },
      monthButton: {
        text: "Month",
        click: () => {
          this.switchToMonthView();
        }
      },
      weekButton: {
        text: "Week",
        click: () => {
          this.switchToWeekView();
        }
      },
      dayButton: {
        text: "Day",
        click: () => {
          this.switchToDayView();
        }
      },
      listButton: {
        text: "List",
        click: this.toggleView.bind(this, false)
      }
    },

    headerToolbar: {
      left: "prev,next today myCustomButton",
      center: "title",
      right: ""
    },
    // right: "dayGridMonth,timeGridWeek,timeGridDay,weekButton,listButton"
    events: this.eventDataList,
    editable: false,
    selectable: true,
    eventTimeFormat: {
      // This ensures time is displayed correctly
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    },
    // dateClick: arg => {
    //   this.evntFormGroup.patchValue({ eventDate: arg.dateStr });
    //   this.openEventDialog();
    // },

    dayMaxEventRows: true,
    dayMaxEvents: 3,

    eventClick: this.handleEventClick.bind(this),
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventOrder: "start"
  };
  showStartDate = false;
  showEndDate = false;
  calendarApi: any;
  customerData: any;
  priorityTicketData = [];
  ticketId: any;
  cdr: any;
  evntFormGroup: FormGroup;
  teamListFromStaffData: any;
  searchFormGroup: FormGroup;
  searchOptionSelect1: any = [];
  createAccess: boolean = false;
  viewAccess: boolean = false;
  dateAccess: boolean = false;
  public loginService: LoginService;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private messageService: MessageService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private teamsService: TeamsService,
    public commondropdownService: CommondropdownService,
    public customerService: CustomerService,
    public ticketManagementService: TicketManagementService,
    private taskManagementService: TaskManagementService,
    public datepipe: DatePipe,
    private router: Router,
    loginService: LoginService,
    private confirmationService: ConfirmationService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(TECHNICIAN_DIARY_SYSTEMS.ADD_EVENT);
    this.viewAccess = loginService.hasPermission(TECHNICIAN_DIARY_SYSTEMS.VIEW_EVENT);
    this.dateAccess = loginService.hasPermission(TECHNICIAN_DIARY_SYSTEMS.DATE_CLICK);
  }

  eventId: any;

  ngOnInit(): void {
    this.getTicketPriority();
    this.getTicket();
    this.getTeamData();
    this.loginUserName = localStorage.getItem("loginUserName");

    let data = history.state.data;
    this.searchFormGroup = this.fb.group({
      teamId: ["", Validators.required],
      currentAssigneeId: ["", Validators.required],
      caseStatus: ["", Validators.required]
    });

    this.evntFormGroup = this.fb.group({
      caseCategoryId: [""],
      eventId: [""],
      caseTitle: ["", Validators.required],
      eventDuration: ["", Validators.required],
      eventDate: [""],
      startDate: [""],
      endDate: [""],
      teamId: ["", Validators.required],
      currentAssignee: [""],
      currentAssigneeId: ["", Validators.required],
      customersId: [data ? data.id : "", Validators.required],
      caseType: ["", Validators.required],
      firstRemark: ["", Validators.required],
      priority: ["", Validators.required],
      caseStatus: ["", Validators.required],
      serialNumber: [""],
      nextFollowupDate: [""],
      nextFollowupTime: [""]
    });

    const currentDate = new Date();
    this.today = currentDate;

    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + 7);

    this.groupEventsByDate(currentDate, endDate);

    this.evntFormGroup.get("eventDuration")?.valueChanges.subscribe(duration => {
      this.onDurationChange(duration);
    });
    this.saveSelCustomer(false);
    this.getCaseType();
    this.getCaseStatus();
    this.getTeamList();
    this.getTeamData();
    this.searchOptionSelect1 = this.commondropdownService.customerSearchOption;
  }

  openEventDialog(): void {
    this.displayDialog = true;
    this.showStartDate = false;
    this.showEndDate = false;
    this.createTicketFun();
  }

  switchToMonthView() {
    if (this.calendarComponent) {
      this.calendarComponent.getApi().changeView("dayGridMonth");
    }
  }
  switchToWeekView() {
    if (this.calendarComponent) {
      this.calendarComponent.getApi().changeView("timeGridWeek");
    }
  }
  switchToDayView() {
    if (this.calendarComponent) {
      this.calendarComponent.getApi().changeView("timeGridDay");
    }
  }

  toggleAgendaPane() {
    this.isAgendaPaneOpen = !this.isAgendaPaneOpen;
    if (this.isAgendaPaneOpen) {
      const today = moment().startOf("day");
      const eventsForToday = this.eventDataList.filter((event: any) => {
        const eventStartDate = moment(event.start);
        return eventStartDate.isSame(today, "day");
      });
      this.selectedEvents = eventsForToday;
    } else {
      this.selectedEvents = [];
    }

    setTimeout(() => {
      if (this.calendarComponent) {
        this.calendarComponent.getApi().updateSize();
      }
    }, 10);
  }

  showTodayEvents() {
    const today = moment().startOf("day");
    const eventsForToday = this.eventDataList.filter((event: any) => {
      const eventStartDate = moment(event.start);
      return eventStartDate.isSame(today, "day");
    });

    // Update the selected events and open the agenda pane
    this.selectedEvents = eventsForToday;
    this.isAgendaPaneOpen = true;

    setTimeout(() => {
      if (this.calendarComponent) {
        this.calendarComponent.getApi().updateSize();
      }
    }, 10);
  }
  onDurationChange(duration: string): void {
    this.viewMode = duration;
    if (duration === "allDay") {
      this.showEventDate = true;
      this.showStartDate = false;
      this.showEndDate = false;
      this.evntFormGroup.get("eventDate")?.setValidators(Validators.required);
      this.evntFormGroup.get("eventDate")?.updateValueAndValidity();
      this.evntFormGroup.get("startDate")?.clearValidators();
      this.evntFormGroup.get("startDate")?.updateValueAndValidity();
      this.evntFormGroup.get("endDate")?.clearValidators();
      this.evntFormGroup.get("endDate")?.updateValueAndValidity();
      this.evntFormGroup.get("startDate")?.reset();
      this.evntFormGroup.get("endDate")?.reset();
    } else if (duration === "flexible") {
      this.showEventDate = false;
      this.showStartDate = true;
      this.showEndDate = true;
      this.evntFormGroup.get("startDate")?.setValidators(Validators.required);
      this.evntFormGroup.get("startDate")?.updateValueAndValidity();
      this.evntFormGroup.get("endDate")?.setValidators(Validators.required);
      this.evntFormGroup.get("endDate")?.updateValueAndValidity();
      this.evntFormGroup.get("eventDate")?.clearValidators();
      this.evntFormGroup.get("eventDate")?.updateValueAndValidity();
      this.evntFormGroup.get("eventDate")?.reset();
    } else {
      this.showEventDate = false;
      this.showStartDate = false;
      this.showEndDate = false;
      this.evntFormGroup.get("startDate")?.setValidators(Validators.required);
      this.evntFormGroup.get("startDate")?.updateValueAndValidity();
      this.evntFormGroup.get("endDate")?.setValidators(Validators.required);
      this.evntFormGroup.get("endDate")?.updateValueAndValidity();
      this.evntFormGroup.get("eventDate")?.clearValidators();
      this.evntFormGroup.get("eventDate")?.updateValueAndValidity();
      this.evntFormGroup.get("eventDate")?.reset();
      this.evntFormGroup.get("endDate")?.reset();
    }
  }

  getFormattedOnlyStartDate(date: string): string {
    if (!date) return "";
    const eventDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    return eventDate.toLocaleDateString("en-IN", options);
  }
  getFormattedStartDate(date: string): string {
    if (!date) return "";
    const eventDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    };
    return eventDate.toLocaleDateString("en-IN", options);
  }

  getFormattedStartTime(date: string): string {
    if (!date) return "";
    const eventDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    };
    return eventDate.toLocaleTimeString("en-US", options);
  }
  getFormattedDate(date: string | Date): string {
    return date ? new Date(date).toLocaleString() : "N/A";
  }
  getEventDuration(event: any): string {
    if (event?.start && event?.end) {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const duration = Math.abs(end.getTime() - start.getTime());
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} hrs ${minutes} mins`;
    }
    return "N/A";
  }

  initializeCalendar() {
    this.calendarOptions = {
      initialView: "dayGridMonth",
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      customButtons: {
        today: {
          text: "Today",
          click: () => {
            const calendarApi = this.calendarComponent.getApi();
            calendarApi.today();
            this.showTodayEvents();
          }
        },
        monthButton: {
          text: "Month",
          click: () => {
            this.switchToMonthView();
          }
        },
        weekButton: {
          text: "Week",
          click: () => {
            this.switchToWeekView();
          }
        },
        dayButton: {
          text: "Day",
          click: () => {
            this.switchToDayView();
          }
        }
      },
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: ""
      },
      // right: "dayGridMonth,timeGridWeek,timeGridDay,listButton"
      events: this.getEventsWithRandomColors(),
      editable: false,
      selectable: true,
      eventTimeFormat: {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      },
      //   dateClick: arg => {
      //     this.selectedEvent = this.findEventByDate(arg.date); // A method to find the event
      //     this.isAgendaPaneOpen = true;
      //   },
      dayMaxEventRows: 2,
      dayMaxEvents: 3,
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      eventMouseEnter: this.handleEventMouseEnter.bind(this)
    };
  }

  generateRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getEventsWithRandomColors() {
    if (!this.eventDataList || this.eventDataList.length === 0) {
      return [];
    }
    return this.eventDataList.map(event => ({
      ...event,
      color: this.generateRandomColor()
    }));
  }

  handleDateClick(arg: any) {
    setTimeout(() => {
      if (this.calendarComponent) {
        this.calendarComponent.getApi().updateSize();
      }
    }, 10);
    if (!this.dateAccess) {
      return;
    }
    // this.toggleAgendaPane();
    else {
      const clickedDate = arg.dateStr;
      const eventsForDate = this.eventDataList.filter((event: any) => {
        //   const eventDate = new Date(event.start).toISOString().split("T")[0];
        //   return eventDate === clickedDate;
        const eventDate = moment(event.start).format("YYYY-MM-DD");
        return eventDate === moment(clickedDate).format("YYYY-MM-DD");
      });

      this.selectedEvents = eventsForDate;
      this.isAgendaPaneOpen = true;
    }
  }

  findEventByDate(date: Date): any {
    return this.eventDataList.find(
      event => new Date(event.start).toDateString() === new Date(date).toDateString()
    );
  }

  calculateDuration(start: string, end: string | null, allDay: boolean): string {
    if (allDay) {
      return "All Day";
    }

    const startMoment = moment(start);
    const endMoment = end ? moment(end) : moment();
    const duration = moment.duration(endMoment.diff(startMoment));

    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    return `${hours}h ${minutes}m`;
  }
  handleEventMouseEnter(info: any) {
    const event = info.event;
    const startDate = event.start ? new Date(event.start) : null;
    const endDate = event.end ? new Date(event.end) : null;
    const isAllDay = event.allDay;

    let startTime = "";
    let endTime = "";

    if (!isAllDay) {
      startTime = startDate ? moment(startDate).format("YYYY-MM-DD HH:mm") : "";
      endTime = endDate ? moment(endDate).format("YYYY-MM-DD HH:mm") : "";
    }

    const tooltip = document.createElement("div");
    tooltip.classList.add("event-tooltip");

    tooltip.innerHTML = `
    <div class="tooltip-content">
      <strong class="tooltip-title">Title: ${event.title || "-"}</strong>
      <span class="tooltip-date">Customer Name: ${event._def.extendedProps.customerName || "-"}</span>
      <span class="tooltip-date">Assignee: ${event._def.extendedProps.assigneeName || "-"}</span>
      <span class="tooltip-date">Team: ${event._def.extendedProps.teamName || "-"}</span>
      <span class="tooltip-date">First Remark: ${event._def.extendedProps.remark || "-"}</span>
      <span class="tooltip-date">Duration: ${
        isAllDay ? "All Day" : `${startTime} to ${endTime}`
      }</span>
    </div>
  `;

    // Add tooltip to body
    document.body.appendChild(tooltip);

    // Position the tooltip based on mouse position
    tooltip.style.position = "absolute";
    tooltip.style.top = `${info.jsEvent.clientY + 10}px`;
    tooltip.style.left = `${info.jsEvent.clientX + 10}px`;

    // Event listener to remove the tooltip when mouse leaves the event
    const handleMouseLeave = () => {
      tooltip.remove();
      info.el.removeEventListener("mouseleave", handleMouseLeave);
    };

    info.el.addEventListener("mouseleave", handleMouseLeave);
    info.el.addEventListener("click", () => {
      tooltip.remove(); // Remove tooltip on click
    });
  }

  getTicket() {
    const url = "/calendarCase/allCalenderCases";
    this.taskManagementService.postFullMethod(url).subscribe(
      (response: any) => {
        if (response && response.dataList) {
          this.eventDataList = response.dataList
            ?.map(ticket => {
              return {
                id: ticket.caseId,
                title: ticket.caseTitle,
                start: ticket.startDate,
                end: ticket.endDate,
                allDay: ticket.endDate == null ? true : false,
                extendedProps: {
                  caseType: ticket.caseType,
                  caseStatus: ticket.caseStatus,
                  assigneeName: ticket.assigneeName,
                  priority: ticket.priority,
                  department: ticket.department,
                  remark: ticket.firstRemark,
                  teamName: ticket.teamName,
                  customerName: ticket.customerName
                }
              };
            })
            .flat();
        } else {
          this.eventDataList = response.dataList;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Record Found.",
            icon: "far fa-times-circle"
          });
        }
        this.calendarOptions.events = this.eventDataList;
        this.initializeCalendar();
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

  checkAvailablity() {
    this.submitted = true;
    if (this.evntFormGroup.valid) {
      let url;
      let startDateTime;
      let endDateTime;
      if (
        this.evntFormGroup.get("eventDate").value !== null &&
        this.evntFormGroup.get("eventDate").value !== ""
      ) {
        startDateTime =
          this.datePipe.transform(this.evntFormGroup.get("eventDate").value, "yyyy-MM-dd") +
          "T00:00:00";
      } else {
        const startDate = this.evntFormGroup.get("startDate")?.value;
        const endDate = this.evntFormGroup.get("endDate")?.value;
        const formattedStartDate = moment(startDate).format("YYYY-MM-DDTHH:mm:ss");
        const formattedEndDate = moment(endDate).format("YYYY-MM-DDTHH:mm:ss");

        startDateTime = formattedStartDate;
        endDateTime = formattedEndDate;
      }
      if (this.evntFormGroup.value.eventDuration == "allDay") {
        url =
          "/case/checkAvailablity?staffId=" +
          this.evntFormGroup.value.currentAssigneeId +
          "&startingTime=" +
          startDateTime;
      } else {
        url =
          "/case/checkAvailablity?staffId=" +
          this.evntFormGroup.value.currentAssigneeId +
          "&startingTime=" +
          startDateTime +
          "&endingTime=" +
          endDateTime;
      }
      this.taskManagementService.getMethod(url).subscribe(
        (response: any) => {
          if (response.dataList.length > 0) {
            this.confirmationService.confirm({
              header: "Alert",
              message:
                "This staff member is already assigned an event at the specified time. Do you want to allocate a new event?",
              icon: "pi pi-info-circle",
              accept: () => {
                this.saveEvent("");
              },
              reject: () => {}
            });
          } else {
            this.saveEvent("");
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

  convertTimeToDate(time: string): Date {
    const date = new Date();
    const [hours, minutes, seconds] = time.split(":").map(Number);
    date.setHours(hours, minutes, seconds, 0); // Set time on current date
    return date;
  }

  onStartDateSelect(event: Date): void {
    if (event) {
      this.showEndDate = true;
      const startDate = this.evntFormGroup.get("startDate")?.value;
      this.evntFormGroup.get("endDate")?.setValue(null);
      this.evntFormGroup.get("endDate")?.clearValidators();
      this.evntFormGroup
        .get("endDate")
        ?.setValidators([Validators.required, control => this.checkEndDate(control, startDate)]);

      this.evntFormGroup.get("endDate")?.markAsTouched();
      this.evntFormGroup.get("endDate")?.updateValueAndValidity();
    }
  }

  checkEndDate(control: AbstractControl, startDate: Date): { [key: string]: boolean } | null {
    const endDate = control.value;
    if (endDate) {
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();
      const oneHourInMilliseconds = 60 * 60 * 1000;
      if (endDateTime < startDateTime + oneHourInMilliseconds) {
        return { invalidDate: true };
      }
    }
    return null;
  }

  onEndDateSelect(event: Date): void {
    this.evntFormGroup.get("endDate")?.updateValueAndValidity();
  }

  formatTimeRange(startDate: string, endDate: string): string {
    const startTime = this.datePipe.transform(startDate, "hh:mm a");
    const endTime = this.datePipe.transform(endDate, "hh:mm a");
    return `${startTime} - ${endTime}`;
  }

  createTicketFun(): void {
    this.showStatus = false;
    this.showServices = false;
    this.viewTicket = false;
    this.createTicket = true;
    this.submitted = false;
    this.isTicketEdit = false;
    this.evntFormGroup.reset();
    this.selectedFilePreview = [];
    this.detailTicket = false;
    this.getResolutionReasons("Open");
    this.evntFormGroup.patchValue({
      priority: "Low"
    });
    this.evntFormGroup.controls.caseStatus.setValue("Open");
    this.evntFormGroup.controls.caseType.setValue("Task");
    this.searchcaseStatus = "";
    this.searchservicearea_id = "";
    this.searchticketReasonCategoryId = "";
  }

  groupEventsByDate(startDate: Date, endDate: Date): void {
    this.dayWiseEvents = {};
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const formattedDate = this.datePipe.transform(currentDate, "yyyy-MM-dd");
      if (!this.dayWiseEvents[formattedDate]) {
        this.dayWiseEvents[formattedDate] = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.eventDataList.forEach(event => {
      const eventDateKey = this.datePipe.transform(event.start, "yyyy-MM-dd");

      if (event.allDay) {
        // For all-day events, add to the specific date's array
        if (this.dayWiseEvents[eventDateKey]) {
          this.dayWiseEvents[eventDateKey].push(event);
        }
      } else {
        // For events with a time range, loop through each date in the range and add the event
        const start = new Date(event.start);
        const end = new Date(event.end);
        const loopDate = new Date(start);

        while (loopDate <= end) {
          const formattedLoopDate = this.datePipe.transform(loopDate, "yyyy-MM-dd");
          if (this.dayWiseEvents[formattedLoopDate]) {
            this.dayWiseEvents[formattedLoopDate].push(event);
          }
          loopDate.setDate(loopDate.getDate() + 1);
        }
      }
    });
  }

  addEvent() {
    const eventDate = new Date();
    const formattedDate = this.datePipe.transform(eventDate, "yyyy-MM-dd HH:mm");

    const event = {
      title: "Sample Event",
      startDate: formattedDate
    };

    const dateKey = event.startDate.split(" ")[0];
    if (!this.dayWiseEvents[dateKey]) {
      this.dayWiseEvents[dateKey] = [];
    }
    this.dayWiseEvents[dateKey].push(event);
  }

  cancelEvent(): void {
    this.evntFormGroup.reset();
    this.displayDialog = false;
    this.isUpdateMode = false;
    this.selectedEventId = null;
  }

  updateEvent(
    eventId: string,
    updatedData: { title?: string; startDate?: string; endDate?: string; allDay?: boolean }
  ): void {
    const calendarApi = this.calendarComponent.getApi();
    const event = calendarApi.getEventById(eventId);

    if (event) {
      if (updatedData.title) {
        event.setProp("title", updatedData.title);
      }

      if (updatedData.startDate || updatedData.endDate) {
        const start = updatedData.startDate || event.startStr;
        const end = updatedData.endDate || updatedData.startDate || event.endStr;
        const allDay = updatedData.allDay !== undefined ? updatedData.allDay : event.allDay;

        if (allDay) {
          event.setDates(start, null, { allDay });
        } else {
          event.setDates(start, end, { allDay: false });
        }
      }
    } else {
    }
  }

  toggleView(showCalendar: boolean): void {
    this.showCalendar = showCalendar;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  saveEvent(ticketId): void {
    this.submitted = true;
    if (this.evntFormGroup.valid) {
      if (ticketId) {
        this.createTicketData = this.evntFormGroup.value;
        this.createTicketData.serialNumber = this.evntFormGroup.value.serialNumber
          ? this.evntFormGroup.value.serialNumber.toString()
          : "";
        this.updateTicketData.caseTitle = this.createTicketData.caseTitle;
        this.updateTicketData.ticketId = ticketId;
        this.updateTicketData.status = this.createTicketData.caseStatus;
        this.updateTicketData.caseType = this.createTicketData.caseType;
        this.updateTicketData.assignee = this.createTicketData.currentAssignee;
        this.updateTicketData.currentAssigneeId = this.createTicketData.currentAssigneeId;
        this.updateTicketData.priority = this.createTicketData.priority;
        this.updateTicketData.groupReasonId = this.createTicketData.groupReasonId;
        this.updateTicketData.caseCategoryId = this.createTicketData.caseCategoryId;
        this.updateTicketData.remark = this.createTicketData.firstRemark;
        this.updateTicketData.serialNumber = this.createTicketData.serialNumber;
        this.updateTicketData.rootCauseReasonId = this.createTicketData.rootCauseReasonId;
        this.updateTicketData.source = this.createTicketData.source;
        this.updateTicketData.subSource = this.createTicketData.subSource;
        this.updateTicketData.helperName = this.createTicketData.helperName;
        this.updateTicketData.createby = this.createTicketData.createby;
        this.updateTicketData.updateby = this.createTicketData.updateby;
        this.updateTicketData.nextFollowupDate = this.createTicketData.nextFollowupDate;
        this.updateTicketData.nextFollowupTime = this.formatTime(
          this.createTicketData.nextFollowupTime
        );

        if (
          this.evntFormGroup.get("eventDate").value !== null &&
          this.evntFormGroup.get("eventDate").value !== ""
        ) {
          this.updateTicketData.startDate =
            this.datePipe.transform(this.evntFormGroup.get("eventDate").value, "yyyy-MM-dd") +
            "T00:00:00";
        }
        const formData = new FormData();

        formData.append("caseUpdate", JSON.stringify(this.updateTicketData));
        const url = "/case/updateDetails";
        this.taskManagementService.assignMethod(url, formData).subscribe(
          (response: any) => {
            if (response.responseCode === 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else if (response.responseCode === 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.evntFormGroup.reset();
              this.isTicketEdit = false;
              this.getTicket();
              this.displayDialog = false;
              this.evntFormGroup.get("nextFollowupDate").clearValidators();
              this.evntFormGroup.get("nextFollowupDate").updateValueAndValidity();
              this.evntFormGroup.get("nextFollowupTime").clearValidators();
              this.evntFormGroup.get("nextFollowupTime").updateValueAndValidity();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              this.evntFormGroup.controls.caseStatus.setValue("Open");
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
      } else {
        this.selectedFilePreview = [];
        const formData = new FormData();

        this.createTicketData = {
          ...this.createTicketData,
          ...this.evntFormGroup.getRawValue(),
          teamId: this.evntFormGroup.value.teamId || null,
          currentAssigneeId: this.evntFormGroup.value.currentAssigneeId || null
        };

        if (
          this.evntFormGroup.get("eventDate").value !== null &&
          this.evntFormGroup.get("eventDate").value !== ""
        ) {
          this.createTicketData.startDate =
            this.datePipe.transform(this.evntFormGroup.get("eventDate").value, "yyyy-MM-dd") +
            "T00:00:00";
        } else {
          const startDate = this.evntFormGroup.get("startDate")?.value;
          const endDate = this.evntFormGroup.get("endDate")?.value;
          const formattedStartDate = moment(startDate).format("YYYY-MM-DDTHH:mm:ss");
          const formattedEndDate = moment(endDate).format("YYYY-MM-DDTHH:mm:ss");

          this.createTicketData.startDate = formattedStartDate;
          this.createTicketData.endDate = formattedEndDate;
        }

        this.createTicketData.serialNumber = this.evntFormGroup.value.serialNumber
          ? this.evntFormGroup.value.serialNumber.toString()
          : "";
        this.createTicketData.mvnoId = this.mvnoid;

        this.createTicketData.caseStatus === "Open";
        this.createTicketData.caseForPartner = "Customer";
        this.createTicketData.caseFor = "Customer";
        this.createTicketData.caseOrigin = "Phone";
        if (this.createTicketData.caseStatus === "Follow Up") {
          const follwTime = this.datepipe.transform(
            this.createTicketData.nextFollowupTime,
            "HH:mm:ss"
          );
          this.createTicketData.nextFollowupTime = follwTime;
        }

        this.createTicketData.firstRemark = this.evntFormGroup.controls.firstRemark.value;
        let fileArray: FileList;
        if (this.createTicketData.file) {
          fileArray = this.evntFormGroup.controls.file.value;
          Array.from(fileArray).forEach(file => {
            formData.append("file", file);
          });
        }
        let newFormData = Object.assign({}, this.createTicketData);
        formData.append("entityDTO", JSON.stringify(newFormData));
        const url = "/case/save";
        this.taskManagementService.postMethod(url, formData).subscribe(
          (response: any) => {
            if (response.responseCode === 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else if (response.responseCode === 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else if (response.responseCode === 401) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.evntFormGroup.reset();
              this.displayDialog = false;
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });

              this.evntFormGroup.get("nextFollowupDate").clearValidators();
              this.evntFormGroup.get("nextFollowupDate").updateValueAndValidity();
              this.evntFormGroup.get("nextFollowupTime").clearValidators();
              this.evntFormGroup.get("nextFollowupTime").updateValueAndValidity();
              this.submitted = false;
              this.evntFormGroup.controls.caseStatus.setValue("Open");
              this.getTicket();
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
  }

  getTicketById(ticketId) {
    const url = "/case/" + ticketId;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.viewTicketData = response.data;
        this.ticketDeatailData = response.data;
        if (this.ticketDeatailData.currentAssigneeId) {
          this.getTicketCurrentAssigneeData(this.ticketDeatailData.currentAssigneeId);
        }
        this.deletedata = this.viewTicketData;
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

  getTicketCurrentAssigneeData(staffId) {
    const url = "/staffuser/" + staffId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.assignStaffData = response.Staff;
        this.assignStaffParentId = this.assignStaffData.parentStaffId;
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

  handleEventClick(arg: any): void {
    if (!this.viewAccess) {
      return;
    } else {
      const event = arg.event;
      this.ticketId = event.id;
      this.router.navigate(["/home/technicianDiaryDetails/isFromCalendar/" + this.ticketId]);
      this.evntFormGroup.patchValue({
        eventId: event.id,
        caseTitle: event.title,
        eventDuration: event.allDay ? "allDay" : "flexible",
        eventDate: event.start,
        startDate: event.start,
        endDate: event.end,
        teamId: event.teamId || "",
        currentAssignee: event.staffId || "",
        customersId: event.customerId || "",
        firstRemark: event.firstRemark || ""
      });
      if (event.end !== null) {
        this.showStartDate = true;
        this.showEndDate = true;
        this.showEventDate = false;
      } else {
        this.showStartDate = false;
        this.showEndDate = false;
        this.showEventDate = true;
      }
      // this.displayDialog = true;
      this.showCalendar = false;
    }
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  responseTimetSet() {
    const date = new Date();
    this.TATDetails = this.parentTRCData.find(
      element => element.categoryId == this.evntFormGroup.controls.caseCategoryId.value
    ).caseCategoryTatMappingList;
    const ticket = this.TATDetails.find(
      element => element.caseCategoryId == this.evntFormGroup.controls.caseCategoryId.value
    )?.ticketTatMatrix;
    const timeUnit = ticket ? ticket.runit : "DAY";
    const time = ticket ? ticket.rtime : 1;
    if (timeUnit == "DAY") {
      date.setDate(date.getDate() + time);
    } else if (timeUnit == "HOUR") {
      date.setHours(date.getHours() + time);
    } else {
      date.setMinutes(date.getMinutes() + time);
    }
    this.createTicketData.nextFollowupDate = this.datepipe.transform(date, "yyyy-MM-dd");
    this.createTicketData.nextFollowupTime = this.datepipe.transform(date, "HH:mm:ss");
  }

  formatTime(fromTime) {
    if (typeof fromTime != "string") {
      let hour = new Date(fromTime).getHours();
      let min = new Date(fromTime).getMinutes();
      if (hour < 10) {
        if (min < 10) {
          fromTime = `0${hour}:0${min}`;
        } else {
          fromTime = `0${hour}:${min}`;
        }
      } else {
        if (min < 10) {
          fromTime = `${hour}:0${min}`;
        } else {
          fromTime = `${hour}:${min}`;
        }
      }
      return fromTime;
    } else {
      return fromTime;
    }
  }

  onSelectTeam(event) {
    if (event.value !== null && event.value !== undefined) {
      this.getStaffData(event.value);
    }
  }

  getStaffData(id: any) {
    const url = "/staffuser/getByTeamId?teamId=" + id;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.staffDataList = response.dataList;
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

  onSelectStaff(event) {
    if (event.value !== null && event.value !== undefined) {
      this.evntFormGroup.controls.caseStatus.setValue("In Progress");
      this.evntFormGroup.controls.caseStatus.disable();
    } else {
      this.evntFormGroup.controls.caseStatus.setValue(null);
      this.evntFormGroup.controls.caseStatus.enable();
    }
  }

  getTeamData() {
    const url = "/teams/getAllTeamsWithoutPagination";
    this.taskManagementService.getTeamAll(url).subscribe(
      (response: any) => {
        this.teamListData = response.dataList;
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

  getTeamList() {
    let loggedInStaffId = localStorage.getItem("userId");
    let url = "/calendarCase/teamListForCurrentStaff?staffId=" + loggedInStaffId;
    this.taskManagementService.getTeamFromStaffList(url).subscribe(
      (response: any) => {
        this.teamListFromStaffData = response.dataList;
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

  onSearch(formValue) {
    let data = {
      currentAssigneeId: formValue.currentAssigneeId,
      caseStatus: formValue.caseStatus
    };
    let url = "/calendarCase/allCalenderCasesForCurrentStaffAndStatus";
    this.taskManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response && response.dataList) {
          this.eventDataList = response.dataList?.map(ticket => {
            return {
              id: ticket.caseId,
              title: ticket.caseTitle,
              start: ticket.startDate,
              end: ticket.endDate,
              extendedProps: {
                caseType: ticket.caseType,
                caseStatus: ticket.caseStatus,
                assigneeName: ticket.assigneeName,
                priority: ticket.priority,
                department: ticket.department,
                remark: ticket.firstRemark,
                teamName: ticket.teamName,
                customerName: ticket.customerName
              }
            };
          });
        } else {
          this.eventDataList = response.dataList;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Record Found.",
            icon: "far fa-times-circle"
          });
        }
        this.calendarOptions.events = this.eventDataList;
        this.initializeCalendar();
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

  onClear() {
    this.searchFormGroup.reset();
    this.getTicket();
  }

  async modalOpenParentCustomer() {
    this.displaySelectCustomer = true;
    await this.getParentCustomerData();
    this.newFirst = 1;
    this.selectedParentCust = [];
  }

  getParentCustomerData() {
    let currentPage;
    currentPage = this.currentPageParentCustomerListdata;
    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    const url = "/getActivecustomers/list?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerService.postMethod(url, data).subscribe(
      (response: any) => {
        this.customerList = response.customerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
        this.newFirst = 1;
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

  async saveSelCustomer(isOpenModal) {
    this.parentCustList = [
      {
        id: Number(this.selectedParentCust.id),
        username: this.selectedParentCust.username,
        name: this.selectedParentCust.name,
        mobile: this.selectedParentCust.mobile,
        customerAddress: this.selectedParentCust.customerAddress
      }
    ];

    // Store the saved customer details
    this.savedCustomerDetails = {
      id: Number(this.selectedParentCust.id)
      // username: this.selectedParentCust.username,
      // name: this.selectedParentCust.name,
      // mobile: this.selectedParentCust.mobile,
      // customerAddress: this.selectedParentCust.customerAddress,
      // selectedCustAddressType: selectedAddressType
    };

    // Update the form value
    this.evntFormGroup.patchValue({
      customersId: Number(this.selectedParentCust.id)
    });

    if (isOpenModal) {
      this.modalCloseParentCustomer();
    }

    // Optionally show a confirmation of saving or perform additional actions here
  }

  showSavedCustomerDetails() {
    if (this.savedCustomerDetails) {
      const url = "/customers/" + this.evntFormGroup.value.customersId;
      this.customerService.getMethod(url).subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.customerDetailData = response.customers;
            this.savedCustomerDetails = {
              id: Number(this.customerDetailData.id),
              username: this.customerDetailData.username,
              name: this.customerDetailData.custname,
              mobile: this.customerDetailData.mobile,
              customerAddress:
                this.customerDetailData.addressList.length > 0
                  ? this.customerDetailData.addressList[0].fullAddress
                  : "N/A",
              selectedCustAddressType:
                this.customerDetailData.addressList.length > 0
                  ? this.customerDetailData.addressList[0].addressType
                  : "N/A",
              planName:
                this.customerDetailData.planMappingList.length > 0
                  ? this.customerDetailData.planMappingList[0].planName
                  : "N/A"
            };
            this.displaySavedCustomerDialog = true;
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
    } else {
    }
  }

  modalCloseParentCustomer() {
    this.displaySelectCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 1;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    this.customerList = [];
  }

  getCaseType() {
    const url = "/commonList/taskType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.caseTypeData = response.dataList.filter(item => item.text === "Task");
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

  getCaseStatus() {
    this.createStatusList = [];
    this.ChangestatusList = [];

    const url = "/commonList/taskStatus";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        // this.statusData = response.dataList;
        this.createStatusList = response.dataList;
        // this.ChangestatusList = this.statusData;
        this.searchFormGroup.controls.caseStatus.setValue("Open");
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

  getResolutionReasons(event) {
    var value = event;
    if (value === "Follow Up") {
      this.evntFormGroup.controls.nextFollowupDate.setValidators(Validators.required);
      this.evntFormGroup.controls.nextFollowupDate.updateValueAndValidity();
      this.evntFormGroup.controls.nextFollowupTime.setValidators(Validators.required);
      this.evntFormGroup.controls.nextFollowupTime.updateValueAndValidity();
    } else {
      this.evntFormGroup.controls.nextFollowupDate.clearValidators();
      this.evntFormGroup.controls.nextFollowupDate.updateValueAndValidity();
      this.evntFormGroup.controls.nextFollowupTime.clearValidators();
      this.evntFormGroup.controls.nextFollowupTime.updateValueAndValidity();
    }
  }

  getTicketPriority() {
    const url = "/commonList/ticket_priority";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.priorityTicketData = response.dataList;
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
  closeCustomerDetailsModel() {
    this.displaySavedCustomerDialog = false;
  }
  closeCustomer() {
    this.displaySavedCustomerDialog = false;
  }

  paginate(event) {
    this.currentPageParentCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchParentCustValue) {
      this.searchParentCustomer();
    } else {
      this.getParentCustomerData();
    }
  }
  searchParentCustomer() {
    const searchParentData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageParentCustomerListdata,
      pageSize: this.parentCustomerListdataitemsPerPage
    };

    searchParentData.filters[0].filterValue = this.searchParentCustValue;
    searchParentData.filters[0].filterColumn = this.searchParentCustOption.trim();

    const url = "/customers/search/Both?mvnoId=" + localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.customerService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        this.customerList = response.customerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.parentCustomerListdatatotalRecords = 0;
        if (error.error.status == 400 || error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          // this.customerListData = [];
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
  clearSearchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    this.getParentCustomerData();
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  selParentSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
  }

  // Check if the content is truncated
  isEllipsisActive(elementRef: ElementRef | HTMLElement): boolean {
    const element = elementRef instanceof ElementRef ? elementRef.nativeElement : elementRef;
    if (element) {
      return element.offsetWidth < element.scrollWidth;
    }
    return false;
  }

  navigateToDetails(eventId: number): void {
    this.router.navigate([`/home/technicianDiaryDetails/isFromCalendar/${eventId}`]);
  }
}
