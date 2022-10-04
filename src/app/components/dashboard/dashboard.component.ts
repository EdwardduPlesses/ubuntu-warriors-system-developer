import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartData, ChartOptions} from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard.service';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnInit {
  chartsLoaded: boolean = false;

  //array of available reporters
  reports: any[] = [
    { value: 'products', viewValue: 'Products' },
    { value: 'sales', viewValue: 'Sales' },
    { value: 'customers', viewValue: 'Customers' },
    { value: 'repairs', viewValue: 'Repairs' },
    { value: 'suppliers', viewValue: 'Suppliers' },
    { value: 'inventory', viewValue: 'Inventory' },
    { value: 'salesByCustomer', viewValue: 'Sales By Customer' },
    { value: 'productsbyType', viewValue: 'Products By Type' },

  ];

  productsFilter = ['All', 'Available', 'Low Stock', 'Not Available'];
  salesFilter = ['All', 'Pending', 'Complete', 'Refunded'];
  customersFilter = ['All', 'Pretoria', 'Johannesburg', 'Cape Town'];
  repairsFilter = ['All', 'New Repair', 'Busy', 'Done', 'Collected', 'EmailSent'];

  //Products PieChart
  productPieChartData: any[] = [];
  productPieChartDataSource = new MatTableDataSource<any>(
    this.productPieChartData
  );

  //products report columns and datasource
  products: any[] = [];
  productdisplayedColumns: string[] = ['Name', 'Price', 'Quantity', 'Status'];
  productdataSource = new MatTableDataSource<any>(this.products);

  //sales report columns and datasource
  sales: any[] = [];
  saledisplayedColumns: string[] = ['Customer', 'Amount', 'Date', 'Status'];
  saledataSource = new MatTableDataSource<any>(this.sales);

  //customer report columns and datasource
  customers: any[] = [];
  customerdisplayedColumns: string[] = ['Title', 'Name', 'Suburb', 'City'];
  customerdataSource = new MatTableDataSource<any>(this.sales);

  //repair report columns and datasource
  repairs: any[] = [];
  repairdisplayedColumns: string[] = ['Name', 'Status', 'Customer', 'Cost', 'Start Date', 'Deadline'];
  repairdataSource = new MatTableDataSource<any>(this.repairs);

  //supplier report columns and datasource
  suppliers: any[] = [];
  supplierdisplayedColumns: string[] = ['Name', 'Contact', 'Email', 'Address'];
  supplierdatasource = new MatTableDataSource<any>(this.suppliers);

  //Inventory Report columns and datasource
  inventory: any[] = [];
  inventorydisplayedColumns: string[] = ['Name', 'Description', 'Quantity', 'Status'];
  inventorydatasource = new MatTableDataSource<any>(this.inventory);

  //Sales By Customer columns and datasource
  salesByCustomer: any[] = [];
  salesbyCustomerdisplayedColumns: string[] = ['Customer', 'Customer Email', 'Total Sales', 'Sales Status'];
  salesbyCustomerDataSource = new MatTableDataSource<any>(this.salesByCustomer);

  //products by product type columns and datasource
  productsByType: any[] = [];
  productsByTypedisplayedColumns: string[] = ['Category', 'Number of Products', 'Total Products in Category', 'Percentage Total'];
  productsByTypeDataSource = new MatTableDataSource<any>(this.productsByType)
  
  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort = new MatSort();

  async ngAfterViewInit() {
    this.productdataSource.paginator = this.paginator;
    this.productdataSource.sort = this.sort;

    this.saledataSource.paginator = this.paginator;
    this.saledataSource.sort = this.sort;

    this.customerdataSource.paginator = this.paginator;
    this.customerdataSource.sort = this.sort;

    this.repairdataSource.paginator = this.paginator;
    this.repairdataSource.sort = this.sort;

    this.supplierdatasource.paginator = this.paginator;
    this.supplierdatasource.sort = this.sort;

    this.inventorydatasource.paginator = this.paginator;
    this.inventorydatasource.sort = this.sort;

    this.salesbyCustomerDataSource.paginator = this.paginator;
    this.salesbyCustomerDataSource.sort = this.sort;

    this.productsByTypeDataSource.paginator = this.paginator;
    this.productsByTypeDataSource.sort = this.sort;
  }

  //product Statuses (pie chart for products with low stock or not available)

  productStatusData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  productStatusChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Product availability',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Products in Low Stock or out of Stock',
      },
    },
  };

  // Product Type Chart
  productTypeData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  productTypeChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Product Type',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Product quantity by Type',
      },
    },
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productdataSource.filter = filterValue.trim().toLowerCase();
  }

  async ngOnInit() {
    
    await this.CompilePieCharts().then(() => {
      this.chartsLoaded = true;
    });
    console.log(this.productPieChartData);

    await this.CompileProductDashboard();
    console.log(this.products);

    await this.CompileSaleDashboard();
    console.log('sales data',this.sales);

    await this.ComplileRepairDashboard();
    console.log(this.repairs);

    await this.ComplileCustomerDashboard();
    console.log(this.customers);

    await this.CompileSupplierDashboard();
    console.log(this.suppliers);

    await this.CompileInventoryDashboard();
    console.log(this.inventory);

    await this.CompileSalesByCustomerDashboard();
    console.log(this.salesByCustomer);

    await this.CompileProductsByTypeDashboard();
    console.log(this.productsByType);


    // await this.ComplileRepairDashboard();
    // console.log(this.repairs);

  }

  async filterProduct(filter: string) {
    this.products = await this.dashboardService.CompileProductDashboard();
    console.log('filter', filter);
    if(filter == 'All'){
      this.productdataSource = new MatTableDataSource<any>(this.products[0]);
    }
    else if(filter == 'Available'){
      this.products[0] = this.products[0].filter((product: any) => product.productStatus == 'Available');
      this.productdataSource = new MatTableDataSource<any>(this.products[0]);
    }
    else if(filter == 'Low Stock'){
      this.products[0] = this.products[0].filter((product: any) => product.productStatus == 'Low Stock');
      this.productdataSource = new MatTableDataSource<any>(this.products[0]);
    }
    else if(filter == 'Not Available'){
      this.products[0] = this.products[0].filter((product: any) => product.productStatus == 'Not Available');
      this.productdataSource = new MatTableDataSource<any>(this.products[0]);
    }
    this.productdataSource.paginator = this.paginator;
    this.productdataSource.sort = this.sort;
  }

  async filterSale(filter: string) {
    this.sales = await this.dashboardService.CompileSaleDashboard();
    console.log('filter', filter);
    if(filter == 'All'){
      this.saledataSource = new MatTableDataSource<any>(this.sales[0]);
    }
    else if(filter == 'Pending'){
      this.sales[0] = this.sales[0].filter((sale: any) => sale.saleStatus == 'Pending');
      this.saledataSource = new MatTableDataSource<any>(this.sales[0]);
    }
    else if(filter == 'Complete'){
      this.sales[0] = this.sales[0].filter((sale: any) => sale.saleStatus == 'Complete');
      this.saledataSource = new MatTableDataSource<any>(this.sales[0]);
    }
    else if(filter == 'Refunded'){
      this.sales[0] = this.sales[0].filter((sale: any) => sale.saleStatus == 'Refunded');
      this.saledataSource = new MatTableDataSource<any>(this.sales[0]);
    }
    this.saledataSource.paginator = this.paginator;
    this.saledataSource.sort = this.sort;
  }

  async filterCustomer(filter: string) {
    this.customers = await this.dashboardService.ComplileCustomerDashboard();
    console.log('filter', filter);
    if(filter == 'All'){
      this.customerdataSource = new MatTableDataSource<any>(this.customers[0]);
    }
    else if(filter == 'Pretoria'){
      this.customers[0] = this.customers[0].filter((customer: any) => customer.customerCity == 'Pretoria');
      this.customerdataSource = new MatTableDataSource<any>(this.customers[0]);
    }
    else if(filter == 'Johannesburg'){
      this.customers[0] = this.customers[0].filter((customer: any) => customer.customerCity == 'Johannesburg');
      this.customerdataSource = new MatTableDataSource<any>(this.customers[0]);
    }
    else if(filter == 'Cape Town'){
      this.customers[0] = this.customers[0].filter((customer: any) => customer.customerCity == 'Cape Town');
      this.customerdataSource = new MatTableDataSource<any>(this.customers[0]);
    }
    this.customerdataSource.paginator = this.paginator;
    this.customerdataSource.sort = this.sort;
  }
  
  async filterRepair(filter: string) {
    this.repairs = await this.dashboardService.ComplileRepairDashboard();
    console.log('filter', filter);
    if(filter == 'All'){
      this.repairdataSource = new MatTableDataSource<any>(this.repairs[0]);
    }
    else if(filter == 'New Repair'){
      this.repairs[0] = this.repairs[0].filter((repair: any) => repair.repairStatus == 'New Repair');
      this.repairdataSource = new MatTableDataSource<any>(this.repairs[0]);
    }
    else if(filter == 'Busy'){
      this.repairs[0] = this.repairs[0].filter((repair: any) => repair.repairStatus == 'Busy');
      this.repairdataSource = new MatTableDataSource<any>(this.repairs[0]);
    }
    else if(filter == 'Done'){
      this.repairs[0] = this.repairs[0].filter((repair: any) => repair.repairStatus == 'Done');
      this.repairdataSource = new MatTableDataSource<any>(this.repairs[0]);
    }
    else if(filter == 'Collected'){
      this.repairs[0] = this.repairs[0].filter((repair: any) => repair.repairStatus == 'Collected');
      this.repairdataSource = new MatTableDataSource<any>(this.repairs[0]);
    }
    else if(filter == 'EmailSent'){
      this.repairs[0] = this.repairs[0].filter((repair: any) => repair.repairStatus == 'EmailSent');
      this.repairdataSource = new MatTableDataSource<any>(this.repairs[0]);
    }
    this.repairdataSource.paginator = this.paginator;
    this.repairdataSource.sort = this.sort;
  }
  
  async CompileProductDashboard() {
    // this.products = await this.dashboardService.CompileProductDashboard();
    // console.log(this.products);
    // this.productdataSource = new MatTableDataSource<any>(this.products[0]);
    await this.filterProduct('All');
  }
  
  async CompileSaleDashboard() {
    // this.sales = await this.dashboardService.CompileSaleDashboard();
    // console.log('this.sales', this.sales);
    // this.saledataSource = new MatTableDataSource<any>(this.sales[0]);
    await this.filterSale('All');
  }

  async ComplileCustomerDashboard() {
    // this.customers = await this.dashboardService.ComplileCustomerDashboard();
    // console.log(this.customers);
    // this.customerdataSource = new MatTableDataSource<any>(this.customers[0]);
    await this.filterCustomer('All');
  }

  async ComplileRepairDashboard() {
    // this.repairs = await this.dashboardService.ComplileRepairDashboard();
    // console.log(this.repairs);
    // this.repairdataSource = new MatTableDataSource<any>(this.repairs[0]);
    await this.filterRepair('All');
  }

  
  async CompileSupplierDashboard() {
    this.suppliers = await this.dashboardService.CompileSupplierDashboard();
    this.supplierdatasource = new MatTableDataSource<any>(this.suppliers);
    
    this.supplierdatasource.paginator = this.paginator;
    this.supplierdatasource.sort = this.sort;
  }
  
  async CompileInventoryDashboard() {
    this.inventory = await this.dashboardService.CompileInventoryDashboard();
    this.inventorydatasource = new MatTableDataSource<any>(this.inventory);
    
    this.inventorydatasource.paginator = this.paginator;
    this.inventorydatasource.sort = this.sort;
  }
  
  async CompileSalesByCustomerDashboard() {
    this.salesByCustomer = await this.dashboardService.CompileSalesByCustomer();
    this.salesbyCustomerDataSource = new MatTableDataSource<any>(this.salesByCustomer);

    this.salesbyCustomerDataSource.paginator = this.paginator;
    this.salesbyCustomerDataSource.sort = this.sort;
  }

  async CompileProductsByTypeDashboard() {
    this.productsByType = await this.dashboardService.CompileProductsByType();
    this.productsByTypeDataSource = new MatTableDataSource<any>(this.productsByType);
    
    this.productsByTypeDataSource.paginator = this.paginator;
    this.productsByTypeDataSource.sort = this.sort;
  }

  async CompilePieCharts() {
    {
      this.productPieChartData =
        await this.dashboardService.CompileProductPieChart();
      console.log('this.productPieChartData', this.productPieChartData[0]);
      this.productPieChartDataSource = new MatTableDataSource<any>(
        this.productPieChartData[0]
      );
     
      let productTypeData: any[] = this.productPieChartData[0];

      productTypeData.forEach((element) => {
        this.productTypeData.labels?.push(element.key);
        this.productTypeData.datasets[0].data.push(element.productQuantity);
      });

      //product Statuses (pie chart for products with low stock or not available)
      let productStatusData: any[] = this.productPieChartData[1];

      productStatusData.forEach((element) => {
        this.productStatusData.labels?.push(element.key);
        this.productStatusData.datasets[0].data.push(element.productQuantity);
        console.log(element);
      });
      console.log('sale labels', this.productStatusData.labels);
      console.log('sale dataset', this.productStatusData.datasets[0].data);
    }
  }

  async exportTable(selectedReport: { value: UserOptions }) {
    console.log(selectedReport.value);
    var doc = new jsPDF("p", "mm", "a4");
    var imgData = '/assets/Images/L.A Arms.jpg';
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight()
    var textX = 0;
    var textY = 0;

    //Image
    doc.addImage(imgData, 'JPEG', 0, 0, width, height);
    autoTable(doc, { 
      html: `#${selectedReport.value}`, 
      styles: {
        fontSize: 12,
        font: 'helvetica'
      },
      startY: 100
    });

    var today = new Date().toLocaleString();
    var newDate = "Date Downloaded : "+ today;
    var downloaded = `Downloaded by: ${this.authService.currentUser.userName}`;
    var pdfName = `${selectedReport.value}.pdf`;
    var tableName = ""

    if(selectedReport.value.toString() == 'products'){
    tableName = "Top 10 most expensive " + selectedReport.value;
    textX = 65
    textY = 95
    }
    else if(selectedReport.value.toString() == 'sales'){
    tableName = "Top " + selectedReport.value;
    textX = 90
    textY = 95
    }
    else if(selectedReport.value.toString() == 'customers'){
    tableName = "Monthly customer report";
    textX = 75
    textY = 95
    }
    else if(selectedReport.value.toString() == 'repairs'){
    tableName = "Repair Deadline";
    textX = 85
    textY = 95
    }

    doc.setTextColor(255,255,255);
    doc.text(newDate, 10 , 60);
    doc.text(downloaded, 10 , 70);
    doc.text(tableName, textX , textY);
    doc.save(pdfName);
  }
}