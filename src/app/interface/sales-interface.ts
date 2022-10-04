export interface Sale {
    saleId: number;
    saleStatusId: number;
    customerName: string;
    saleStatusName: string;
    saleAmount: number;
    saleDate: Date;
    saleReceipt: string;
}