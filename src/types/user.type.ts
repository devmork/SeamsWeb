export interface User {
  userName: string;
  email: string;
  name: string;
  role: string;
}

export interface SignUpData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
}


export interface LogInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}