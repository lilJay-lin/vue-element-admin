import fetch from '../utils/fetch_new';

export function loginByName(loginName, password) {
  const data = {
    loginName,
    password
  };
  return fetch({
    url: '/users/login',
    method: 'post',
    data
  });
}

export function logout() {
  return fetch({
    url: '/users/logout',
    method: 'get'
  });
}

export function getInfo(token) {
  return fetch({
    url: '/users/info',
    method: 'get',
    params: { token }
  });
}

