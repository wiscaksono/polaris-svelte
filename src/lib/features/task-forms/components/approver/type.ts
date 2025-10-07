export interface ApproverRes {
  list_approver: Array<{
    measured_unit: string
    authority_person: string
    authority_limit: string
  }>
}
