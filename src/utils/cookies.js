/**
 * Created by peng on 2017/7/26.
 */

function getXsrfCookie(name) {
    const r = document.cookie.match("\\b" + name + "=([^;]*)\\b")
    return r ? r[1] : undefined
}

export default {
    get (name) {
        return getXsrfCookie(name)
    }
}