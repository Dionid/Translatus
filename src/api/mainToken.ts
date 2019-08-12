
const TOKEN_NAME = "token"

const getToken = () => {
    try {
        return localStorage.getItem(TOKEN_NAME)
    } catch (err) {
        console.error(err)
        return false
    }
}

const saveToken = (token: string) => {
    try {
        localStorage.setItem(TOKEN_NAME, token)
        return true
    } catch (err) {
        console.error(err)

        return false
    }
}

const deleteToken = () => {
    try {
        localStorage.removeItem(TOKEN_NAME)
        return true
    } catch (err) {
        console.error(err)

        return false
    }
}

export {
    getToken,
    saveToken,
    deleteToken,
}
