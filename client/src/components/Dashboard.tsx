import React, {useState} from 'react'

export const Dashboard = () => {
    const [form, setForm] = useState({
        name: '',
        position: '',
        level: ''
    })

    const updateForm = value => {
        return setForm(prev => {
            return {...prev, ...value}
        })
    }

    const onAddPerson = async e => {
        e.preventDefault()
        const newPerson = {...form}
        await fetch('http://localhost:3001/record/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPerson)
        }).catch(error => {
            window.alert(error)
            return
        })
        setForm({name: '', position: '', level: ''})
    }

    return (
        <div>
            <h3>Create New Record</h3>
            <form onSubmit={onAddPerson}>
                <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input
                        type='text'
                        className='form-control'
                        id='name'
                        value={form.name}
                        onChange={e => updateForm({name: e.target.value})}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='position'>Position</label>
                    <input
                        type='text'
                        className='form-control'
                        id='position'
                        value={form.position}
                        onChange={e => updateForm({position: e.target.value})}
                    />
                </div>
                <div className='form-group'>
                    <div className='form-check form-check-inline'>
                        <input
                            className='form-check-input'
                            type='radio'
                            name='positionOptions'
                            id='positionIntern'
                            value='Intern'
                            checked={form.level === 'Intern'}
                            onChange={e => updateForm({level: e.target.value})}
                        />
                        <label htmlFor='positionIntern' className='form-check-label'>
                            Intern
                        </label>
                    </div>
                    <div className='form-check form-check-inline'>
                        <input
                            className='form-check-input'
                            type='radio'
                            name='positionOptions'
                            id='positionJunior'
                            value='Junior'
                            checked={form.level === 'Junior'}
                            onChange={e => updateForm({level: e.target.value})}
                        />
                        <label htmlFor='positionJunior' className='form-check-label'>
                            Junior
                        </label>
                    </div>
                    <div className='form-check form-check-inline'>
                        <input
                            className='form-check-input'
                            type='radio'
                            name='positionOptions'
                            id='positionSenior'
                            value='Senior'
                            checked={form.level === 'Senior'}
                            onChange={e => updateForm({level: e.target.value})}
                        />
                        <label htmlFor='positionSenior' className='form-check-label'>
                            Senior
                        </label>
                    </div>
                </div>
                <div className='form-group'>
                    <input type='submit' value='Create person' className='btn btn-primary' />
                </div>
            </form>
        </div>
    )
}
