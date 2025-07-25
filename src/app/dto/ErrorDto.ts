export class ErrorDto {
  error: string;
}


export function handleError(error: any): string {
  if (error.error.error) {
    return error.error.error;
  }
  return 'An unexpected error occurred.';
}
