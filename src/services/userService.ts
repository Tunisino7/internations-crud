import http from './common';
import { IUser } from "../interface/IUser";

class UserService {
  getAll() {
    return http.get<Array<IUser>>('/users');
  }

  get(id: string) {
    return http.get<IUser>(`/users/${id}`);
  }

  create(data: IUser) {
    return http.post<IUser>('/users', data);
  }

  update(data: IUser, id: string) {
    return http.put<any>(`/users/${id}`, data);
  }

  delete(id: string) {
    return http.delete<any>(`/users/${id}`);
  }

  deleteAll() {
    return http.delete<any>(`/users`);
  }
}

export default new UserService();