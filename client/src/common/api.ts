import {ProjectInterface} from '../../../server/types'

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
