export interface ProfileEditInterface {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  telephone: string;
  role: string;
  password: string;
}

export interface ProfileTableInterface {
  totalPages: number;
  totalElements: number;
  content: ProfileInterface[];
}

export interface ProfileByIdInterface {
  totalPages: number;
  totalElements: number;
  content: ProfileInterface;
}

export interface ProfileInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  image: string;
  createAt: string;
  updateAt: string;
  profileCode: String;
  role: string;
}

export interface ProfileByIdResetPasswordInterface {
  id: number | null;
  password: string | null;
}

export interface ProfileByIdCheckEmailInterface {
  id: number | null;
  email: string | null;
}

export interface ProfileByIdInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  image: string;
  profileCode: string;
  createAt: string;
  updateAt: string;
  role: string;
  roleName: string;
}
