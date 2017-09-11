import Cookies from 'js-cookie'

const TokenKey = 'miAdminId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getPermissions() {
  return Cookies.get('miPermission')
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
