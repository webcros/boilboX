declare module '@googlemaps/js-api-loader' {
  interface Loader {
    load(): Promise<typeof google>;
  }
}
