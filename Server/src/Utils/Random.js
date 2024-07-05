export function RandomPassword (length) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = ""
    for (let i = 0; i<length; i++) {
        let num = Math.floor(Math.random() * chars.length)
        password += chars.substring(num, num+1)
    }
    return password
}