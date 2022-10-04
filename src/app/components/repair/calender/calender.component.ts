import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { endOfDay, isSameDay, isSameMonth, startOfDay } from 'date-fns';
import { RepairService } from 'src/app/services/repair.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ViewRepairDialogComponent } from '../view-repair-dialog/view-repair-dialog.component';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})
export class CalenderComponent implements OnInit {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = false;
  repairs: any = [];

  events: CalendarEvent[] = [];

  constructor(public repairService: RepairService, public dialog: MatDialog, public snackBarService: SnackbarService) {}

  async ngOnInit(): Promise<void> {
    await this.GetRepairs()
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

   async GetRepairs() {
    await this.repairService.getRepairs().then(res =>{
      this.repairs = res;
      console.log("Repairs Calender", this.repairs);
      //Filter into different events
      for (let repairs of this.repairs) {
        this.events = [
          ...this.events,
          {
            start: new Date(repairs.repairDeadline["repairDeadlineDate"]),
            title: "Customer: " + repairs.customer["customerName"] + " " + repairs.customer["customerSurname"] + " - Repair: " + repairs.repairName,
            id: repairs.repairId,
          },
        ];
      }
    })
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.repairs.forEach((repair: any) =>{
      if(repair.repairId === event.id){
        this.repairService.Repair(repair);
        this.dialog.open(ViewRepairDialogComponent, { disableClose: true })
        .afterClosed()
        .subscribe();
      }
    })
  }
}
