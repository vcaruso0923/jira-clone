import {Button} from 'antd'
import React from 'react'

export const Header = () => {
    return (
        <div className='application-header'>
            <div className='header-left'>
                <h1 className='header-logo'>Jira Clone</h1>
                <Button size='large' className='header-button'>
                    Projects
                </Button>
                <Button size='large' className='header-button'>
                    Issues
                </Button>
                <Button size='large' className='header-button'>
                    Create
                </Button>
            </div>

            <div className='header-right'>
                <Button size='large'>Profile</Button>
            </div>
        </div>
    )
}
