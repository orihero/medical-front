
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const createEventId = () => String(eventGuid++)

export const INITIAL_EVENTS = [
    {
        id: createEventId(),
        title: '-Abdusamatov Abdumutal',
        start: todayStr + 'T02:00:00'
    },
    {
        id: createEventId(),
        title: '-John Doe',
        start: todayStr + 'T12:00:00'
    },
    // {
    //     id: createEventId(),
    //     title: '-John Doe',
    //     start: todayStr + 'T11:00:00'
    // },
    // {
    //     id: createEventId(),
    //     title: '-John Doe',
    //     start: todayStr + 'T10:00:00'
    // },
    // {
    //     id: createEventId(),
    //     title: '-John Doe',
    //     start: todayStr + 'T09:00:00'
    // },
    {
        id: createEventId(),
        title: '-Will Snow',
        start: todayStr + 'T24:00:00'
    },
]
