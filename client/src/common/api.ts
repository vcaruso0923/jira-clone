import {IssueInterface, IssueRequestInterface, ProjectInterface} from '../../../server/types'
import {issueStatusesInOrder} from './constants'

export const loadProjects = async (): Promise<ProjectInterface[] | undefined> => {
    return await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''}/project/search`, {
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Failed to fetch issues')
            }
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error(error)
        })
}

export const loadUsers = async (): Promise<any[] | undefined> => {
    return await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''}/users`, {
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Failed to fetch issues')
            }
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error(error)
        })
}

export const loadSingleIssue = async (issueId: string): Promise<IssueInterface> => {
    return await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''}/issue/${issueId}`, {
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Failed to fetch issues')
            }
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error(error)
        })
}

export const updateSingleIssue = async (issueId: string, issue: IssueRequestInterface) => {
    return await fetch(
        `${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''}/issue/update/${issueId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(issue)
        }
    )
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Failed to fetch issues')
            }
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error(error)
        })
}

export const loadAndUpdateIssuesStatus = async (issueId: string, moveWhichDirection: 'right' | 'left') => {
    const issueToChange = await loadSingleIssue(issueId)

    // remove object properties form issueToChange: _id and date
    delete issueToChange?._id
    delete issueToChange?.date

    await updateSingleIssue(issueId, {
        ...issueToChange,
        // @ts-ignore
        issueStatus:
            issueStatusesInOrder[
                moveWhichDirection === 'right'
                    ? //@ts-ignore
                      issueStatusesInOrder.indexOf(issueToChange.issueStatus) + 1
                    : //@ts-ignore
                      issueStatusesInOrder.indexOf(issueToChange.issueStatus) - 1
            ]
    })
}
