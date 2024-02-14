import {Button} from 'antd'
import React from 'react'

export const Header = () => {
    return (
        <div className='application-header'>
            <div className='header-left'>
                <Button className='header-logo'>Jira Clone</Button>
            </div>

            <div className='header-middle'>
                <Button>I'm a button</Button>
            </div>

            <div className='header-right'></div>
        </div>
    )
}
