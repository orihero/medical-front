import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import { INITIAL_EVENTS } from '../../utils/event-utils'

const Screen2 = () => {
    const history = useHistory()

    const [state, setState] = useState({ currentEvents: [] })


    const handleEvents = events => setState({ ...state, currentEvents: events })

    const handleDateClick = arg => history.push('/screen-3', [{title: 'Hello world!', date: arg.dateStr}])

    return (
        <div className='scheduleContainer'>
            <FullCalendar
                viewClassNames='view-class'
                moreLinkClassNames='more-link-class'
                dayCellClassNames='my-class'
                dayCellContent={({ date, dayNumberText }) => (
                    <div className='abs-cont'>
                        <p>{dayNumberText}</p>
                        <div className='abs'>+2</div>
                    </div>
                )}

                editable={true}
                weekends={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                eventsSet={handleEvents}
                initialView='dayGridMonth'
                dateClick={handleDateClick}
                initialEvents={INITIAL_EVENTS}
                titleFormat={{ year: 'numeric', month: 'short' }}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            />
        </div>
    )
}

export default Screen2