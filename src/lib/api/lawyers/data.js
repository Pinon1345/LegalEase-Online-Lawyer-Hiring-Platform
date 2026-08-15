import { serverFetch } from "../server";

export const lawyerProfile = async (userId) => {
    try {
        const result = await serverFetch(`/api/lawyers/user/${userId}`);

        // Return null if lawyer doesn't exist yet or endpoint returns error message

        if (!result || result.message === "Lawyer not found" || result.error) {
            return null;
        }

        return result;
    } catch (error) {
        console.error("Error fetching lawyer profile:", error);
        return null;
    }
};




// Fetch all lawyers from http://localhost:5000/api/lawyers


// export const getLawyers = async () => {
//     try {
//         const data = await serverFetch("/api/lawyers");
//         return data;
//     } catch (error) {
//         console.error("Error fetching lawyers:", error);
//         return [];
//     }
// };



export const getLawyers = async (params = {}) => {
    try {
        // Convert params object (page, limit, search, etc.) into URL query string
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/api/lawyers?${queryString}` : "/api/lawyers";

        const data = await serverFetch(endpoint);
        return data;
    } catch (error) {
        console.error("Error fetching lawyers:", error);
        return { lawyers: [], totalPages: 1, totalLawyers: 0 };
    }
};
