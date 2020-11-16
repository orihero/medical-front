
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const createEventId = () => String(eventGuid++)

export const getJsonFromUrl = (url) => {
    if (!url) return {};

    var question = url.indexOf("?");
    var hash = url.indexOf("#");
    if (hash == -1 && question == -1) return {};
    if (hash == -1) hash = url.length;

    var query = question == -1 || hash == question + 1
        ? url.substring(hash)
        : url.substring(question + 1, hash);
    var result = {};

    query.split("&").forEach(function (part) {
        if (!part) return;

        part = part.split("+").join(" "); // replace every + with space, regexp-free version

        var eq = part.indexOf("=");
        var key = eq > -1 ? part.substr(0, eq) : part;
        var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
        var from = key.indexOf("[");

        if (from == -1) result[decodeURIComponent(key)] = val;
        else {
            var to = key.indexOf("]", from);
            var index = decodeURIComponent(key.substring(from + 1, to));
            key = decodeURIComponent(key.substring(0, from));
            if (!result[key]) result[key] = [];
            if (!index) result[key].push(val);
            else result[key][index] = val;
        }
    });
    return result;
}

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
