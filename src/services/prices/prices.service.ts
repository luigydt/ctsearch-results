import { AxiosService } from '../axios.service';
// import axios from 'axios';
import { PriceBody, PriceParams } from './prices.interfaces';

export class PriceService {
  // private url: string = 'localhost:servivuelo/prices';
  // private query: string;
  // private body: PriceBody;
  private axiosService: AxiosService;
  constructor() {
    // this.query = getTimeTablesQuery(queryParams);
    // this.body = body;
    // this.axiosService = new AxiosService('localhost:servivuelo/timetables', this.query, this.body);
  }

  public async getPrice() {
    return await this.axiosService.getData();
  }

  public async getPriceByParams(queryParams: PriceParams, body: PriceBody): Promise<string> {
    // const journeyDestination = await this.axiosService.getDataByParams(
    //   this.url,
    //   getTimeTablesQuery(queryParams),
    //   body,
    // );
    return (Math.floor(Math.random() * 10) + 20).toString();
  }
}
