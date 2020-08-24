import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, Form } from 'react-bootstrap'
import axios from 'axios'

const idk1 = 'Apply'
const idk2 = 'Occupied'

const fullnameText = 'Full name'
const phoneText = 'Phone Number'
const addressText = 'Address'
const emailText = 'Email address'

const url = 'http://142.93.79.101/api'

let workTime = {
    startTime: new Date(),
    endTime: new Date()
}

workTime.startTime.setHours(9, 0, 0, 0)
workTime.endTime.setHours(18, 0, 0, 0)

const Screen3 = () => {
    const [state, setState] = useState({
        email: '',
        phone: '',
        comment: '',
        address: '',
        fullname: '',
        branch_id: 3,
        arrived_at: null,
    })
    const [modalShow, setModalShow] = useState(false)
    const [errorText, setErrorText] = useState({})
    const [times, setTimes] = useState([])

    const handleWorkTime = (start, end) => {
        let arr = []
        let tmpTime = start

        while(tmpTime < end){
            arr = [...arr, new Date(tmpTime)]
            
            let tmpTimeHour = tmpTime.getHours()
            let tmpTimeMinutes = tmpTime.getMinutes() + 5
            let tmpTimeSeconds = tmpTime.getSeconds()
            let tmpTimeMillieconds = tmpTime.getMilliseconds()

            tmpTime.setHours(tmpTimeHour, tmpTimeMinutes, tmpTimeSeconds, tmpTimeMillieconds)
        }

        return arr
    }

    const effect = () => {
        console.log('startTime: ', workTime.startTime)
        console.log('endTime: ', workTime.endTime)
        setTimes([...handleWorkTime(workTime.startTime, workTime.endTime)])
    }

    useEffect(() => {
        effect()
    }, [])

    const handleClose = () => {
        setModalShow(false)
        setState({
            email: '',
            phone: '',
            address: '',
            comment: '',
            fullname: '',
            branch_id: 3,
            arrived_at: null,
        })
    }

    const handleOpen = item => {
        setState({...state, arrived_at: item})
        setModalShow(true)
    }

    const handleSubmit = async () => {
        if(state.fullname && state.phone && state.address){
            try{
                await axios.post(`${url}/requests`, {...state})
                console.log('state: ', state)
                setErrorText({})
                setState({
                    email: '',
                    phone: '',
                    address: '',
                    comment: '',
                    fullname: '',
                    branch_id: 3,
                    arrived_at: null,
                })
                setModalShow(false)
            } catch(err){
                setErrorText({request: true})
            }
        } else {
            let newError = {}
            if(!state.fullname){
                newError = {...newError, fullname: true}
            }
            if(!state.phone){
                newError = {...newError, phone: true}
            }
            if(!state.address){
                newError = {...newError, address: true}
            }
            setErrorText(newError)
        }
    }

    return(
        <>
            <div className='scheduleContainer'>
                <div className='header'>
                    <div className='title'>August 24 2020</div>
                    <div>
                        <Button className='mr-1'>←</Button>
                        <Button className='ml-1'>→</Button>
                    </div>
                </div>
                <Table striped bordered hover className='mt-5'>
                    <thead>
                        <tr>
                            <th className='time'>Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {times.map((item, index) => (
                            <tr key={index}>
                                <td className='time'>{`${item.getHours()}:${item.getMinutes()}`}</td>
                                <td style={{display: 'flex', justifyContent: 'center'}}>
                                    <Button onClick={() => handleOpen(item)}>{idk1}</Button>
                                    {/* <Button variant="warning">{idk2}</Button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={modalShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {errorText.request ? (<p className='mt-2' style={{color: '#eb5757'}}>Try again later!</p>) : null}
                    <Form>
                        <Form.Group controlId="formBasicFullname">
                            <Form.Label>{fullnameText}</Form.Label>
                            <Form.Control
                                type="text"
                                value={state.fullname}
                                placeholder={`Enter ${fullnameText}`}
                                onChange={({ target }) => setState({...state, fullname: target.value})}
                            />
                            {errorText.fullname ? (<Form.Text className='mt-2' style={{color: '#eb5757'}}>
                                {`Enter ${fullnameText}`}
                            </Form.Text>) : null}
                        </Form.Group>

                        <Form.Group controlId="formBasicPhoneNumber">
                            <Form.Label>{phoneText}</Form.Label>
                            <Form.Control
                                type="text"
                                value={state.phone}
                                placeholder={`Enter ${phoneText}`}
                                onChange={({ target }) => setState({...state, phone: target.value})}
                            />
                            {errorText.phone ? (<Form.Text className='mt-2' style={{color: '#eb5757'}}>
                                {`Enter ${phoneText}`}
                            </Form.Text>) : null}
                        </Form.Group>

                        <Form.Group controlId="formBasicAddress">
                            <Form.Label>{addressText}</Form.Label>
                            <Form.Control
                                type="text"
                                value={state.address}
                                placeholder={`Enter ${addressText}`}
                                onChange={({ target }) => setState({...state, address: target.value})}
                            />
                            {errorText.address ? (<Form.Text className='mt-2' style={{color: '#eb5757'}}>
                                {`Enter ${addressText}`}
                            </Form.Text>) : null}
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>{emailText}</Form.Label>
                            <Form.Control
                                type="email"
                                value={state.email}
                                placeholder={`Enter ${emailText}`}
                                onChange={({ target }) => setState({...state, email: target.value})}
                            />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                rows="3"
                                as="textarea"
                                value={state.comment}
                                onChange={({ target }) => setState({...state, comment: target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleSubmit}>{idk1}</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Screen3



// console.log('props.location: ', props.location)
// console.log('date: ', new Date(props.location.state[0].date))