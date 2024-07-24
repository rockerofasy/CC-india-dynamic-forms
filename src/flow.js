const fetchSheetData = async () => {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyYC_fIb193ge5vFQvTwOwLHrez_kry_12GCtMw2ltzMKhWmCJ4w5X6CkswK_ImutJY/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();

        // Call formatData and return its result
        return formatData(data);

    } catch (error) {
        console.error('Error:', error);
        throw new Error(error);
    }
};

// Define formatData function
const formatData = (data) => {
    const formatArray = (arr) => {
        return arr.map((item, index) => ({
            id: index.toString(),
            title: item
        }));
    };

    return {
        country: formatArray(data.Country),
        city: formatArray(data.City),
        university: formatArray(data.University),
        tenancy: formatArray(data.Tenancy),
        budget: formatArray(data.Budget)
    };
};




let sheetData = {};

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


        try {
            sheetData = await fetchSheetData();
        } catch (error) {
            console.error('Failed to fetch sheet data:', error);
            throw new Error('Failed to fetch sheet data');
        }

        return {
            ...sheetData,
            version,
            screen: "MY_FIRST_SCREEN",
            data: sheetData,
        };
    }

    if (action === "data_exchange") {
        // handle the request based on the current screen
        switch (screen) {
            case "MY_FIRST_SCREEN":
                // TODO: process flow input data

                console.log("screen 1 data ----");

                console.log(data);

                console.log("----------------------")


                console.log(data.country);
                console.log(data.city);
                console.log(data.university);
                console.log(data.tenancy);
                console.log(data.budget);
                console.log("----------------------")
                const countryName =
                    sheetData.country.find(
                        (x) => x.id === data.country
                    ).title;
                const cityName = sheetData.city.find(
                    (x) => x.id === data.city
                ).title;
                const universityName = sheetData.university.find(
                    (x) => x.id === data.university
                ).title;
                const tenancyName = sheetData.tenancy.find(
                    (x) => x.id === data.tenancy
                ).title;
                const budgetName = sheetData.budget.find(
                    (x) => x.id === data.budget
                ).title;
                console.log("----------------------")
                console.log(countryName);
                console.log(cityName);
                console.log(universityName);
                console.log(tenancyName);
                console.log(budgetName);
                console.log("----------------------")

                // send success response to complete and close the flow
                return {
                    version,
                    screen: "MY_SECOND_SCREEN",
                    data: {
                        flow_token,
                        country: countryName,
                        city: cityName,
                        university: universityName,
                        tenancy: tenancyName,
                        budget: budgetName,
                    },
                };
            case "MY_SECOND_SCREEN":
                // TODO: process flow input data
                // Find the corresponding titles for the selected IDs




                // send success response to complete and close the flow
                return {


                    version,
                    screen: "SUCCESS",
                    data: {
                        flow_token,
                        country: countryName,
                        city: cityName,
                        university: universityName,
                        tenancy: tenancyName,
                        budget: budgetName,

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
