// sharedState.js

let state = {
    phoneNumber: "",
    userNs: ""
};

const setPhoneNumber = (phone) => {
    state.phoneNumber = phone;
};

const getPhoneNumber = () => {
    return state.phoneNumber;
};

const setUserNS = (ns) => {
    state.userNs = ns;
};

const getUserNS = () => {
    return state.userNs;
}



export { setPhoneNumber, getPhoneNumber, getUserNS, setUserNS };
