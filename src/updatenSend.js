import fetch from 'node-fetch';
import { getUserNS } from './sharedState.js';

const API_HEADERS = {
    'accept': 'application/json',
    'Authorization': 'Bearer iEDr3jt0AXGQ5TTBgHWEC88sBMLpDa5p8zH89MIWTObRPjkoxR9nSoDBxQv6',
    'Content-Type': 'application/json'
};

const updateUserField = async (user_ns, value1, value2) => {
    const url = 'https://chat.gappa.io/api/subscriber/set-user-fields';
    const body = JSON.stringify({
        user_ns,
        data: [
            {
                var_ns: "f78201v746197",
                value: value1,
            },
            {
                var_ns: "f78201v746199",
                value: value2,
            }

        ]

    });

    console.log('UpdateUserField Request Body:', body);

    const response = await fetch(url, {
        method: 'PUT',
        headers: API_HEADERS,
        body
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        console.error('UpdateUserField Error Response:', errorResponse);
        throw new Error(`Error updating user field: ${response.statusText}`);
    }

    return response.json();
};

const sendNode = async (user_ns) => {
    const url = 'https://chat.gappa.io/api/subscriber/send-node';
    const body = JSON.stringify({
        user_ns,
        node_ns: "f78201n46630325"
    });

    console.log('SendNode Request Body:', body);

    const response = await fetch(url, {
        method: 'POST',
        headers: API_HEADERS,
        body
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        console.error('SendNode Error Response:', errorResponse);
        throw new Error(`Error sending node: ${response.statusText}`);
    }

    return response.json();
};

const updateAndSend = async (user_ns, value1, value2) => {
    if (!user_ns) {
        throw new Error('User namespace is not set');
    }

    try {
        // First API call
        const updateResponse = await updateUserField(user_ns, value1, value2);

        // Second API call, only if the first one succeeds
        const sendResponse = await sendNode(user_ns);

        return { updateResponse, sendResponse };
    } catch (error) {
        console.error('Error in updateAndSend:', error);
        throw new Error('Failed to update user field and send node');
    }
};

export { updateAndSend };
