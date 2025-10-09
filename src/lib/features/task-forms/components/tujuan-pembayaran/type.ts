export interface TujuanPembayaranRes {
  internalFunding: Array<{
    id: number
    regSpaj: string
    policyNo: string
    policyHolderName: string
    lsccnId: number
    amount: number
    kurs: string
    fundingName: string
  }>
  transferOut: Array<{
    mtftpId: number
    accountHolder: string
    accountNo: string
    bankName: string
    kurs: string
    lsbpId: number
  }>
  paymentPurpose: {
    transfer: boolean
    internalFunding: boolean
  }
}
