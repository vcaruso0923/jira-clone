import { Request } from 'express'
import {ObjectId} from 'mongodb'

export interface IssueRequestInterface extends Partial<Request> {
    parentProject: ObjectId
    sprint: 'Sprint 1' | 'Sprint 2' | 'Sprint 3'
    title: string
    issueStatus: 'Planned' | 'In Development' | 'In Clarification' | 'In QA' | 'Closed'
    issueType: 'Bug' | 'Feature' | 'Task'
    issuePriority: 'High' | 'Medium' | 'Low'
    description: string
    assignee: ObjectId
    reporter: string
    workPointEstimate?: number
    dueDate?: Date
    linkedTickets?: ObjectId[]
}

export interface IssueInterface {
    _Id: ObjectId
    date: Date
    parentProject: ObjectId
    sprint: 'Sprint 1' | 'Sprint 2' | 'Sprint 3'
    title: string
    issueStatus: 'Planned' | 'In Development' | 'In Clarification' | 'In QA' | 'Closed'
    issueType: 'Bug' | 'Feature' | 'Task'
    issuePriority: 'High' | 'Medium' | 'Low'
    description: string
    assignee: ObjectId
    reporter: string
    workPointEstimate?: number
    dueDate?: Date
    linkedTickets?: ObjectId[]
}

export interface ProjectRequestInterface extends Partial<Request> {
    projectName: string
    childIssues?: ObjectId[]
}

export interface ProjectInterface {
    _Id: ObjectId
    date: Date
    projectName: string
    childIssues?: ObjectId[]
}