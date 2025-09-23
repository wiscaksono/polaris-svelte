export interface TransactionHistoriesRes {
  status_transaksi: Array<{
    created_date: string
    status_internal: string
    status_transaksi: string
  }>
}

