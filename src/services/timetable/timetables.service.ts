import { TimeTableBody, TimeTableQuery, getTimeTablesQuery } from './timetable.interface';
import { AxiosService } from '../axios.service';
// import axios from 'axios';
import { TimeTable } from './timetable.interface';

export class TimeTableService {
  // private url: string = 'localhost:servivuelo/timetables';
  // private query: string;
  // private body: TimeTableBody;
  private axiosService: AxiosService;
  constructor() {
    // this.query = getTimeTablesQuery(queryParams);
    // this.body = body;
    // this.axiosService = new AxiosService('localhost:servivuelo/timetables', this.query, this.body);
  }

  public async getTrainJourney() {
    return await this.axiosService.getData();
  }

  public async getTrainJourneyByParams(
    queryParams: TimeTableQuery,
    body: TimeTableBody,
  ): Promise<{ timetables: TimeTable[] }> {
    // const journeyDestination = await this.axiosService.getDataByParams(
    //   this.url,
    //   getTimeTablesQuery(queryParams),
    //   body,
    // );
    return {
      timetables: [
        {
          shipId: '123456',
          departureDate: '09:00',
          arrivalDate: '15:00',
        },
        {
          shipId: '123987',
          departureDate: '13:00',
          arrivalDate: '18:00',
        },
      ],
    };
  }
}
