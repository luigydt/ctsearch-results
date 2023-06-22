import axios, { AxiosResponse } from 'axios';
const apiClient = axios.create();

export class AxiosService {
  private url: string;
  private queryParams: string;
  private body: {};
  constructor(url: string, queryParams: string, body: {}) {
    this.url = url;
    this.queryParams = queryParams;
    this.body = body;
  }
  async getData() {
    try {
      const response: AxiosResponse = await axios.post(this.url, this.body, {
        params: this.queryParams,
      });
      return JSON.parse(response.data);
    } catch (error) {
      return null;
    }
  }
  async getDataByParams(url: string, queryParams: string, body) {
    try {
      const response: AxiosResponse = await axios.post(url, body, {
        params: queryParams,
      });
      return JSON.parse(response.data);
    } catch (error) {
      return null;
    }
  }
}
