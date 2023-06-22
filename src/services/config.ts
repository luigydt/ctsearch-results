export const config = {
  trainEngineDataBase: 'mongodb://localhost:27017/trainEngine',
  searchesDataBase: 'mongodb://localhost:27017/searches',

  routes: {
    servivuelo: '/servivuelo',
  },
  collections: {
    trainEngine: {
      journeyDestinationTree: 'journey_destination_tree',
      supplierStationCorrelation: 'supplier_station_correlation',
    },
    results: { trainResults: 'train_results' },
  },
};
