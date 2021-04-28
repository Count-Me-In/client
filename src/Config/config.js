let token;

export function setToken(newToken) {
    token = newToken;
}

export function TOKEN() {
  return token;  
} 
//export const API_URL = 'http://ec2-3-16-130-74.us-east-2.compute.amazonaws.com:8080'
export const API_URL = 'http://localhost:8080'
  