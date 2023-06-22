import { CTSearch, Journey, OptionJourney, Parameters } from 'src/types';
import { TimeTableService } from './timetable/timetables.service';
import mongoose, { Document, Model } from 'mongoose';
import { config } from './config';
import { Journey_Destination_Tree_Schema } from './schemas/journey.schema';
import { Suplier_Statin_Correlation_Schema } from './schemas/supplier_station_correlation.schema';
import { AccommodationService } from './accommodation/accommodations.service';
import { PriceService } from './prices/prices.service';
import { differenceInMinutes, format } from 'date-fns';

export class ResultService {
  private timetableService: TimeTableService = new TimeTableService();
  private accommodationService: AccommodationService = new AccommodationService();
  private priceService: PriceService = new PriceService();
  private config = config;
  constructor() {}

  async getResults(params: Parameters): Promise<CTSearch[]> {
    //Config DB TrainEngine and Colletion/s
    const trainEngineDB = mongoose.createConnection(this.config.trainEngineDataBase);
    const journeyDestinationTree = trainEngineDB.model(
      this.config.collections.trainEngine.journeyDestinationTree,
      Journey_Destination_Tree_Schema,
    );
    const supplierStationCorrelation = trainEngineDB.model(
      this.config.collections.trainEngine.supplierStationCorrelation,
      Suplier_Statin_Correlation_Schema,
    );

    //Config DB Results and Colletion/s
    // const searches = mongoose.createConnection(this.config.searchesDataBase);
    // const searchResults = searches.model(this.config.collections.results.trainResults);

    const { journeys, passenger, bonus } = params;
    //Variable que almacenará todos los journeys que denden del param, por ejemplo para Mad/ Bcn habrá tantos viajes como estaciones estén disponibles
    const journeyTotal: Journey[] = [];

    const codes: string[] = [];

    // Obtener los Trayectos Disponbibales a partir del array journeys.
    for (const journeyData of journeys) {
      const journeyTrips = await journeyDestinationTree
        .find({
          $and: [
            { $or: [{ destinationCode: journeyData.from }, { destinationTree: journeyData.from }] },
            { $or: [{ arrivalCode: journeyData.to }, { arrivalTree: journeyData.to }] },
          ],
        })
        .exec();

      journeyTrips.forEach(trip => {
        if (!codes.includes(trip.destinationCode)) {
          codes.push(trip.destinationCode);
        }
        if (!codes.includes(trip.arrivalCode)) {
          codes.push(trip.arrivalCode);
        }
        const tripData: Journey = JSON.parse(JSON.stringify(trip));
        tripData.date = journeyData.date;
        tripData.options = [];
        journeyTotal.push(tripData);
      });
    }

    //Obtenemos los Códigos de los Proveedores
    const correlation_codes = await supplierStationCorrelation
      .find({ code: { $in: codes } })
      .exec();
    //Obtenemos el código del Proveedor Servivuelo y dejamos el string del final para los códigos del Servicio.
    const codesServivuelo = correlation_codes.reduce(
      (codeData, correlation) => {
        codeData[correlation.code] = {
          supplierCode: correlation.suppliers
            .find(supplier => supplier.includes('SERVIVUELO'))
            .substring(11),
          code: correlation.code,
        };
        return codeData;
      },
      {} as {
        [x: string]: {
          code: string;
          supplierCode: string;
        };
      },
    );
    //Generaremos el Array con toda la información.

    for await (const journey of journeyTotal) {
      const { timetables } = await this.timetableService.getTrainJourneyByParams(
        { adults: passenger.adults, children: passenger.children },
        {
          from: codesServivuelo[journey.destinationCode].supplierCode,
          to: codesServivuelo[journey.arrivalCode].supplierCode,
          date: journey.date,
        },
      );

      for await (const timeTable of timetables) {
        const { accommodations } = await this.accommodationService.getAccommodationsByParams({
          shipId: timeTable.shipId,
          departureDate: timeTable.departureDate,
        });

        for await (const accommodation of accommodations) {
          if (parseFloat(accommodation.available) > 0) {
            //Teniendo en cuenta que la reserva sera siempre minimo de 1 adulto
            const prices = { adult: 0, children: 0 };
            const priceAdult: string = await this.priceService.getPriceByParams(
              {
                pax: 'adult',
                bonus,
              },
              {
                shipId: timeTable.shipId,
                departureDate: timeTable.departureDate,
                accommodation: accommodation.type,
              },
            );
            prices.adult = parseFloat(priceAdult);
            if (passenger.children > 0) {
              const priceChildren: string = await this.priceService.getPriceByParams(
                {
                  pax: 'children',
                },
                {
                  shipId: timeTable.shipId,
                  departureDate: timeTable.departureDate,
                  accommodation: accommodation.type,
                },
              );
              prices.children = parseFloat(priceChildren);
            }
            const arrivalDate = format(new Date(), 'yyyy-MM-dd') + `T${timeTable.arrivalDate}:00`;
            const departureDate =
              format(new Date(), 'yyyy-MM-dd') + `T${timeTable.departureDate}:00`;
            const diffMinutes = differenceInMinutes(new Date(arrivalDate), new Date(departureDate));

            const option = {
              departure: {
                date: journey.date,
                time: timeTable.departureDate,
                station: codesServivuelo[journey.destinationCode].code,
              },
              arrival: {
                date: journey.date,
                time: timeTable.arrivalDate,
                station: codesServivuelo[journey.arrivalCode].code,
              },
              duration: {
                hour: Math.trunc(diffMinutes / 60),
                // minutes: diffMinutes, // Lo entendí de dos formas, o el total de horas y minutos, o del tiempo X horas X minutos.
                minutes: Math.trunc(diffMinutes % 60),
              },
              accommodation: {
                type: accommodation.type,
                passengers: {
                  adults: passenger.adults.toString(),
                  children: passenger.children.toString(),
                },
              },
              prices,
            };

            journey.options.push(option);
          }
        }
      }
    }

    return this.createResults(journeyTotal);
  }

  private createResults(journeyTotal: Journey[]): CTSearch[] {
    // Cada elemento del Array contiene las distintas opciones para cada trayecto, hay que combinarlas
    const options: OptionJourney[][] = this.generateCombination(
      journeyTotal.map(journey => journey.options),
    );

    const ct_search_results: CTSearch[] = options.map(option => {
      //Aqui es donde viene la duda por los Accomodations. Ya que entiendo que una combinación puede tener distintos accomodation,
      //Pero el objeto CTSearch solo tiene 1 accommodation para distintos journey
      return {} as CTSearch;
    });
    return ct_search_results;
  }

  public generateCombination(options) {
    if (options.length === 1) {
      return options[0].map(element => [element]);
    } else {
      const combinations = [];
      const remainingCombinations = this.generateCombination(options.slice(1));
      options[0].forEach(element => {
        remainingCombinations.forEach(remainingCombination => {
          const combinacion = [element, ...remainingCombination];
          combinations.push(combinacion);
        });
      });
      return combinations;
    }
  }
}
