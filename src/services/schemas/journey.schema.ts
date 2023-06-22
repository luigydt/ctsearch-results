import { Schema } from 'mongoose';

export const Journey_Destination_Tree_Schema = new Schema(
  {
    destinationCode: { type: String },
    destinationTree: [{ type: String }],
    arrivalCode: { type: String },
    arrivalTree: [{ type: String }],
  },
  { collection: 'journey_destination_tree' },
);
