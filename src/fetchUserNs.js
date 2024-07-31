// fetchUserNs.js

import fetch from 'node-fetch';

const fetchUserNs = async (phone_number) => {
    const url = `https://chat.gappa.io/api/subscriber/get-info-by-user-id?user_id=${phone_number}`;
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer iEDr3jt0AXGQ5TTBgHWEC88sBMLpDa5p8zH89MIWTObRPjkoxR9nSoDBxQv6'
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Error fetching user info: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data.user_ns;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw new Error('Failed to fetch user info');
    }
};

export default fetchUserNs;
