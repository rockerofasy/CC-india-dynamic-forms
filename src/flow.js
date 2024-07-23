const SCREEN_RESPONSES = {
    MY_FIRST_SCREEN: {
        version: "3.0",
        screen: "MY_FIRST_SCREEN",
        data: {},
    },
    MY_SECOND_SCREEN: {
        version: "3.0",
        screen: "MY_SECOND_SCREEN",
        data: {
            name: "ankit",
            email: "sdsd",
            phone: "sdsdas",
        },
    },
};

export const getNextScreen = async (decryptedBody) => {
    const { screen, data, version, action, flow_token } = decryptedBody;
    // handle health check request
    if (action === "ping") {
        return {
            version,
            data: {
                status: "active",
            },
        };
    }

    // handle error notification
    if (data?.error) {
        console.warn("Received client error:", decryptedBody.data.name, decryptedBody.data.email, decryptedBody.data.phone);
        return {
            version,
            data: {
                acknowledged: true,
            },
        };
    }

    // handle initial request when opening the flow
    if (action === "INIT") {
        return {
            version,
            screen: "MY_FIRST_SCREEN",
            data: {},
        };
    }

    if (action === "data_exchange") {
        // handle the request based on the current screen
        switch (screen) {
            case "MY_FIRST_SCREEN":
                // TODO: process flow input data

                console.log("screen is 1 : " + data);

                // send success response to complete and close the flow
                return {
                    version,
                    screen: "MY_SECOND_SCREEN",
                    data: {
                        flow_token,
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                    },
                };
            case "MY_SECOND_SCREEN":
                // TODO: process flow input data


                // send success response to complete and close the flow
                return {
                    version,
                    screen: "SUCCESS",
                    data: {

                        flow_token,

                    },
                };

            case "MY_THIRD_SCREEN":
                // TODO: process flow input data
                console.log("screen is 1 : " + data);

                // send success response to complete and close the flow
                return {
                    version,
                    screen: "SUCCESS",
                    data: {
                        flow_token,
                    },
                };

            default:
                break;
        }
    }

    console.error("Unhandled request body:", decryptedBody);
    throw new Error(
        "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
    );
};
