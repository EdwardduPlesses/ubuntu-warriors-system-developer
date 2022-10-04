import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RepairService } from 'src/app/services/repair.service';

@Component({
  selector: 'app-completed-repairs',
  templateUrl: './completed-repairs.component.html',
  styleUrls: ['./completed-repairs.component.css']
})
export class CompletedRepairsComponent implements OnInit {

  displayedColumns: string[] = ['repairName', 'itemName', 'quantityUsed', 'itemPrice', 'totalPrice'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private repairService: RepairService) { }

  ngOnInit(): void {
    this.getCompletedRepairs()
  }

  ngAfterViewInit() {
    //To make the paginator work, uncomment the code
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getCompletedRepairs() {
    await this.repairService.getRepairInventoryItems().then(res => {
      this.dataSource.data = res
      console.log(res)
    })
  }
}