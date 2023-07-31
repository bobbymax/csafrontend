export const header = () => {
    const access = JSON.parse(localStorage.getItem("token"));

    if (access && access.token) {
        return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + access.token,
        };
    } else {
        return {};
    }
}