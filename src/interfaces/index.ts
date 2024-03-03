export interface Service {
  create(payload: any): any;
  update(id: string, payload: any): any;
  delete(id: string): any;
  findById(id: string): any;
  checkExists(id: string): any;
}

export interface Repository {
  create(payload: any): any;

  delete(payload: any): any;

  deleteMany?(filter: any): any;

  update(id: string, payload: any): any;

  updateMany?(filter: any, payload: any): any;

  find(filter: any): any;

  findOne?(filter: any): any;

  findById(filter: any): any;

  count?(filter: any): any;
}
