// import Cookies from 'js-cookie'

// const TokenKey = 'isLogged'

// export function isLogged() {
//   const _isLogged = window.sessionStorage.getItem('token')
//   return _isLogged !== null

//   // const _isLogged = Cookies.get(TokenKey)
//   // if (_isLogged) return true
//   // else return false
// }

export function getToken() {
  return window.sessionStorage.getItem('token')
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  // state.token = token
  return window.sessionStorage.setItem('token', token)
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return window.sessionStorage.clear()
  // return Cookies.remove(TokenKey)
}
