import fetch from '../utils/fetch_new';

export function getPublicKey () {
  return fetch({
    url: '/open/getPublicKey'
  })
}

export function geetest () {
  return fetch({
    method: 'post',
    url: '/open/geetest?t=' + Date.now()
  })
}

export function loginByName(data) {
  return fetch({
    url: '/mi/login',
    method: 'post',
    data
  });
}

export function getInfo (id) {
  return fetch({
    url: '/mi/admin/' + id
  });
}

export function logout() {
  return fetch({
    url: '/mi/logout'
  });
}


