import { baseURL } from "./baseUrl"


export const serverMutation = async (path, method, data) => {
    const res = await fetch(`${baseURL}${path}`, {
        method: method,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res.json();
}


export const serverFetch = async (path) => {
    const res = await fetch(`${baseURL}${path}`)
    return res.json();
}