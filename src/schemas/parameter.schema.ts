import { Schema } from 'mongoose';

export const ParameterSchema = new Schema({
  journeys: [
    {
      from: { type: String },
      to: { type: String },
      date: { type: String },
    },
  ],
  passenger: {
    adults: { type: Number },
    children: { type: Number },
    total: { type: Number },
  },
  bonus: [{ type: String }],
});
