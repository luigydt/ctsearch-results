import { AxiosService } from '../axios.service';
// import axios from 'axios';
import { Accomodation, AccomodationBody } from './accomodation.interface';

export class AccommodationService {
  private url: string = 'localhost:servivuelo/accommodations';
  private body: AccomodationBody;
  private axiosService: AxiosService;
  constructor() {
    // this.query = getTimeTablesQuery(queryParams);
    // this.body = body;
    // this.axiosService = new AxiosService('localhost:servivuelo/accommodations', this.query, this.body);
  }

  public async getAccomodations() {
    return await this.axiosService.getData();
  }

  public async getAccommodationsByParams(
    body: AccomodationBody,
  ): Promise<{ accommodations: Accomodation[] }> {
    // const accommodations = await this.axiosService.getDataByParams(
    //   this.url,
    //   getTimeTablesQuery(queryParams),
    //   body,
    // );
    return {
      accommodations: [
        {
          type: 'Estandar',
          available: '89',
        },
        {
          type: 'Confort',
          available: '23',
        },
        {
          type: 'Premium',
          available: '12',
        },
      ],
    };
  }
}
