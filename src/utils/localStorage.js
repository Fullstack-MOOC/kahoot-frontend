export const authTokenName = 'authToken';

export function getName() {
  return localStorage.getItem(authTokenName);
}

export function setName(token) {
  localStorage.setItem(authTokenName, token);
}
