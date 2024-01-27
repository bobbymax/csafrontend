export const handleReturnedResponse = (response, updating=false) => {
    return {
        status: updating ? "Updated!!" : "Created",
        data: response?.data,
        message: response?.message,
        action: updating ? "alter" : "store",
    }
}