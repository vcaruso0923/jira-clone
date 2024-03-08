import {Request} from 'express'
import {ObjectId} from 'mongodb'

export interface IssueRequestInterface extends Partial<Request> {
    date?: Date
    title: string
    parentProject: ObjectId
    sprint: 'Sprint 1' | 'Sprint 2' | 'Sprint 3'
    issueStatus: 'Planned' | 'In Development' | 'In Clarification' | 'In QA' | 'Closed'
    issueType: 'Bug' | 'Feature' | 'Task'
    issuePriority: 'High' | 'Medium' | 'Low'
    assigneeName: string
    workPointEstimate?: number
    description: string
    dueDate?: Date
    reporter: string
    lastUpdated?: Date
}

export interface IssueInterface {
    _id?: ObjectId
    date?: Date
    title: string
    parentProject: ObjectId
    sprint: 'Sprint 1' | 'Sprint 2' | 'Sprint 3'
    issueStatus: 'Planned' | 'In Development' | 'In Clarification' | 'In QA' | 'Closed'
    issueType: 'Bug' | 'Feature' | 'Task'
    issuePriority: 'High' | 'Medium' | 'Low'
    assigneeName: string
    workPointEstimate?: number
    description: string
    dueDate?: Date
    reporter: string
    lastUpdated?: Date
}

export interface IssuesQueryInterface {
    sprint?: string
    _id?: string
    title?: string
    assigneeName?: string
    projectId?: string
}

export interface ProjectRequestInterface extends Partial<Request> {
    date: Date
    projectName: string
    sprints?: string[]
    childIssues?: ObjectId[]
    lastUpdated?: Date
}

export interface ProjectInterface {
    _id: ObjectId
    date: Date
    projectName: string
    sprints?: string[]
    childIssues?: ObjectId[]
    lastUpdated?: Date
}
