import '@googlemaps/js-api-loader';

declare module '@googlemaps/js-api-loader' {
  interface Loader {
    load(): Promise<typeof google>;
  }
}
