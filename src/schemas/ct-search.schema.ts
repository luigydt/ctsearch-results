import { Schema } from 'mongoose';
import { ParameterSchema } from './parameter.schema';

export const CTSerachSchema = new Schema({
  parameters: { type: ParameterSchema },
  train: {
    type: { type: String },
    journeys: [
      {
        departure: {
          date: { type: String },
          time: { type: String },
          station: { type: String },
        },
        arrival: {
          date: { type: String },
          time: { type: String },
          station: { type: String },
        },
        duration: {
          hours: { type: Number },
          minutes: { type: Number },
        },
      },
    ],
    accomodations: {
      type: { type: String },
      passengers: {
        adults: { type: String },
        children: { type: String },
      },
    },
  },
  price: {
    total: { type: Number },
    breakdown: {
      adult: { type: Number },
      children: { type: Number },
    },
  },
});
