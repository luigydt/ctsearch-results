import { Schema } from 'mongoose';

export const Suplier_Statin_Correlation_Schema = new Schema(
  {
    code: { type: String },
    suppliers: [{ type: String }],
  },
  { collection: 'supplier_station_correlation' },
);
