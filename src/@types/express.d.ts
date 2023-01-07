declare namespace Express {
  export interface Request {
    debug: (txt: string) => void;
  }
}
