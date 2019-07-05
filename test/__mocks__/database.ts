export const DB_CONNECT_STUB = jest.fn().mockImplementation(function() {
  console.log('Database.establishConnection mock called');
});

export const PROCESS_EXIT_STUB = jest.fn<never, [number]>((code) => {
  if (typeof code === 'string' &&
      typeof code === 'function') {
    return code;
  }
});