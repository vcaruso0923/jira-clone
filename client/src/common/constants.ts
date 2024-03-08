export enum IssueStatuses {
    PLANNED = 'Planned',
    IN_DEVELOPMENT = 'In Development',
    IN_CLARIFICATION = 'In Clarification',
    IN_QA = 'In QA',
    CLOSED = 'Closed'
}

export const issueStatusesInOrder = [IssueStatuses.PLANNED, IssueStatuses.IN_DEVELOPMENT, IssueStatuses.IN_CLARIFICATION, IssueStatuses.IN_QA, IssueStatuses.CLOSED]
