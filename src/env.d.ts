// Type definitions for environment variables used in this project
// This helps TypeScript know about process.env.REACT_APP_GOOGLE_CLIENT_ID

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_GOOGLE_CLIENT_ID?: string;
    // add other env vars here as needed
  }
}
