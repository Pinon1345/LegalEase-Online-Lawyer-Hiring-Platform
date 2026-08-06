"use server";

import { serverMutation } from "../server";


// Lawyer Add

export const addLawyer = async (data) => {
    const resData = await serverMutation("/api/lawyer", "POST", data)
    return resData;
}


// Lawyer Update

export const updateLawyer = async (data, id) => {
    // console.log(data, id, "error solve")
    const resData = await serverMutation(`/api/lawyer/${id}`, "PATCH", data)
    return resData;
}