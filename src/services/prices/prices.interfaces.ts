export class PriceParams {
  pax: string;
  bonus?: string[];
}

export class PriceBody {
  shipId: string;
  departureDate: string;
  accommodation: string;
}
