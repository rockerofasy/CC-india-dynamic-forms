import fetchUserNs from "./fetchUserNs.js";
import phoneNumber from "./sendFlow.js";
import { getPhoneNumber, getUserNS } from "./sharedState.js"
import { updateAndSend } from "./updatenSend.js"




let sheetData = {};


const fetchSheetData = async () => {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbzsGzbTGJ8a5JGehLJhYE5ZrbRI6NU9EZzyXtiJ0P2-kE3kecB05aGz25hSLXO3fa7xXA/exec"
  );
  const data = await response.json();
  console;
  return data;
};

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;
  let cityName = "";
  let categoryName = "";
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
    console.warn(
      "Received client error:",
      decryptedBody.data.name,
      decryptedBody.data.email,
      decryptedBody.data.phone
    );
    return {
      version,
      data: {
        acknowledged: true,
      },
    };
  }

  // handle initial request when opening the flow
  if (action === "INIT") {
    sheetData = await fetchSheetData(); // Fetch and set sheet data here
    console.log(flow_token);
    return {
      version,
      screen: "MY_FIRST_SCREEN",
      data: {
        ...sheetData,
        isCategoryEnabled: false,
      },
    };
  }

  if (action === "data_exchange") {
    switch (screen) {
      case "MY_FIRST_SCREEN":
        // Process flow input data based on trigger
        switch (data?.trigger) {
          case "city_selected":
            console.log(sheetData);
            console.log(data);

            return {
              version,
              screen: "MY_FIRST_SCREEN",
              data: {
                ...sheetData,

                flow_token,
                isCategoryEnabled: true,
              },
            };
          case "category_selected":
            return {
              version,
              screen: "MY_FIRST_SCREEN",
              data: {
                ...sheetData,

                flow_token,
              },
            };

          default:
            break;

        }

    }


    const selectedData = data.data;

    sheetData = await fetchSheetData();

    const city = sheetData.city.find((x) => x.id === selectedData?.city);
    const category = sheetData.category.find(
      (x) => x.id === selectedData?.category
    );

    cityName = city ? city.title : "Unknown Country";
    categoryName = category ? category.title : "Unknown City";





    console.log("----------------------");

    console.log("cityName: " + cityName);
    console.log("categoryName: " + categoryName);
    let user_ns = getUserNS()
    console.log("----------------------");


    await updateAndSend(user_ns, cityName, categoryName);










    return {
      version,
      screen: "SUCCESS",
      data: {
        "extension_message_response": {
          "params": {
            flow_token,

          }
        }

      }
    };





  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error(
    "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
  );
};
