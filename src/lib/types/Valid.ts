export class Valid {
  result: boolean;
  message: string;

  constructor({ result, message }: { result: boolean; message: string }) {
    this.result = result;
    this.message = message;
  }
}
