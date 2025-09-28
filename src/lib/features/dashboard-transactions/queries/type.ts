export interface DashboardTransactionsRes {
  overview: {
    totalTransaction: number
    avgProcessingTime: number
    issuesDetected: number
    mostCommonType: string
  }
  processingTime: {
    average: Array<Record<string, number>>
    heatmap: Array<Record<string, number>>
    trend: Array<Record<string, number>>
  }
  transactionType: {
    average: Array<Record<string, number>>
  }
  trendsAndComparison: {
    stage: Array<Record<string, string | number> & { date: string }>
  }
}
