export interface TimeTable {
  shipId: string;
  departureDate: string;
  arrivalDate: string;
}

export function getTimeTablesQuery(timetableParams: TimeTableQuery): string {
  const query = Object.values(timetableParams).reduce((queryString, [paramKey, paramValue]) => {
    queryString += `${paramKey}=${paramValue} `;
    return queryString;
  }, '?');
  return query;
}

export class TimeTableQuery {
  adults: number;
  children: number;
}

export class TimeTableBody {
  from: string;
  to: string;
  date: string;
}
