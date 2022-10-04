import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

export interface Audit {
  auditTrailId: number;
  auditDate: string;
  auditDesc: string;
  transactionType: string;
  username: string;
  entity: string;
}

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})

export class AuditTrailComponent implements OnInit {

  audits: any = []
  displayedColumns: string[] = ['auditTrailID', 'auditDate', 'auditDesc', 'transactionType', 'username', 'entity'];
  dataSource: any = new MatTableDataSource<Audit>()

  constructor(public http: HttpClient, public customerOrderService: CustomerOrderService, public snackBarService: SnackbarService,) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async ngOnInit() {
    await this.getAuditTrails()
  }

  async getAuditTrails() {
    await this.customerOrderService.getAuditTrail().then(
      (res) => {
        this.dataSource.data = res;
        this.audits = res;
        console.log(this.audits)
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackBarService.setMessage('error getting orders');
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}