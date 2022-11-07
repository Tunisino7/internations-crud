import http from './common';
import { IGroup } from "../interface/IGroup";

class GroupService {
  getAll() {
    return http.get<Array<IGroup>>('/groups');
  }

  get(id: string) {
    return http.get<IGroup>(`/groups/${id}`);
  }

  create(data: IGroup) {
    return http.post<IGroup>('/groups', data);
  }

  update(data: IGroup, id: string) {
    return http.put<any>(`/groups/${id}`, data);
  }

  delete(id: string) {
    return http.delete<any>(`/groups/${id}`);
  }

  deleteAll() {
    return http.delete<any>(`/groups`);
  }
}

export default new GroupService();