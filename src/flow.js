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
            version,
            screen: "MY_FIRST_SCREEN",
            data: {
                ...sheetData,
                isCityEnabled: false,
                isUniversityEnabled: false,
                isTenancyEnabled: false,
                isBudgetEnabled: false,
            }
        };
    }

    if (action === "data_exchange") {

        switch (screen) {
            case "MY_FIRST_SCREEN":
                // Process flow input data based on trigger
                switch (data?.trigger) {
                    case "country_selected":
                        console.log(sheetData);
                        console.log(data)

                        return {
                            version,
                            screen: "MY_FIRST_SCREEN",
                            data: {
                                ...sheetData,
                                city: [{ "id": "0", "title": "ankit ki city" }],

                                flow_token,
                                isCityEnabled: true,
                            }
                        };
                    case "city_selected":

                        return {
                            version,
                            screen: "MY_FIRST_SCREEN",
                            data: {
                                ...sheetData,

                                flow_token,
                                isUniversityEnabled: true,
                            }
                        };
                    case "university_selected":
                        return {
                            version,
                            screen: "MY_FIRST_SCREEN",
                            data: {
                                ...sheetData,

                                flow_token,
                                isTenancyEnabled: true,
                            }
                        };
                    case "tenancy_selected":
                        return {
                            version,
                            screen: "MY_FIRST_SCREEN",
                            data: {
                                ...sheetData,

                                flow_token,
                                isBudgetEnabled: true,
                            }
                        };
                    case "budget_selected":
                        return {
                            version,
                            screen: "MY_FIRST_SCREEN",
                            data: {
                                flow_token,

                            }
                        };
                    default:
                        break;
                }

                console.log("screen 1 data ----");
                console.log(data);
                console.log("----------------------");

                const selectedData = data.data;

                sheetData = await fetchSheetData();
                console.log("sheetdtaa--", data);

                const country = sheetData.country.find((x) => x.id === selectedData?.country);
                const city = sheetData.city.find((x) => x.id === selectedData?.city);
                const university = sheetData.university.find((x) => x.id === selectedData?.university);
                const tenancy = sheetData.tenancy.find((x) => x.id === selectedData?.tenancy);
                const budget = sheetData.budget.find((x) => x.id === selectedData?.budget);

                const countryName = country ? country.title : "Unknown Country";
                const cityName = city ? city.title : "Unknown City";
                const universityName = university ? university.title : "Unknown University";
                const tenancyName = tenancy ? tenancy.title : "Unknown Tenancy";
                const budgetName = budget ? budget.title : "Unknown Budget";

                console.log("----------------------");
                console.log(countryName);
                console.log(cityName);
                console.log(universityName);
                console.log(tenancyName);
                console.log(budgetName);
                console.log("----------------------");

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

            // ---------------------------------------------------------------------------


            case "MY_SECOND_SCREEN":
                // Find the corresponding titles for the selected IDs

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
