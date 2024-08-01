// sendFlow.js

import fetch from 'node-fetch';
let phoneNumber = "";

const sendFlowMessage = async (flow_token, phone_number) => {
    phoneNumber = phone_number;

    const fbUrl = 'https://graph.facebook.com/v18.0/258868947301783/messages';
    const fbHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EAAM6dmFbo7YBOZC5AwSMRVzShZAMKlzaeQ580fueAbQNy7Ft8gtmG1GYJwyQ43mDjFMwcAAn1Q8VJrr6OEseQuzut5icI1vKhIpgG7PyflO8dZAXfEuSaiyBAn7pKZAd2VKZCSX2mclzhnb7MOc8oLqIbBnu6uvTeT2rNlowsDx6Q8BPZClt6G9Ty3TtmsoSVNAgZDZD'
    };
    const fbBody = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": phone_number,
        "recipient_type": "individual",
        "type": "interactive",
        "interactive": {
            "type": "flow",
            "header": {
                "type": "text",
                "text": "Not shown in draft mode"
            },
            "body": {
                "text": "Not shown in draft mode"
            },
            "footer": {
                "text": "Not shown in draft mode"
            },
            "action": {
                "name": "flow",
                "parameters": {
                    "flow_message_version": "3",
                    "flow_action": "data_exchange",
                    "flow_token": flow_token,
                    "flow_id": "985794086678258",
                    "flow_cta": "Not shown in draft mode",
                    "mode": "draft"
                }
            }
        }
    });

    try {
        const response = await fetch(fbUrl, {
            method: 'POST',
            headers: fbHeaders,
            body: fbBody
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error sending flow message:', error);
        throw new Error('Error sending flow message');
    }
};

export default sendFlowMessage;
