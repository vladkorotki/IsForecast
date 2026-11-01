import axios, { AxiosError, AxiosResponse } from "axios";
import { catchError, defer, map, Observable, throwError } from "rxjs";

export class HttpClientService {
  public get<T>(url: string): Observable<T> {
    return defer(() => axios.get<T>(url)).pipe(
      map((response: AxiosResponse) => response.data),
      catchError((error: AxiosError) => this.handleError(error)),
    );
  }

  private handleError(error: AxiosError): Observable<never> {
    let errorMessage = "The unknow error happened. We apologize";
    let statusCode = "500";
    if (error.response) {
      statusCode = String(error.response.status);
      errorMessage =
        (error.response.data as any)?.message ||
        `Server error with status ${statusCode}`;
    } else if (error.request) {
      errorMessage = "Сервер не отвечает. Проверьте сетевое соединение.";
      statusCode = "504";
    } else {
      errorMessage = error.message;
    }

    return throwError(() => ({
      status: statusCode,
      message: errorMessage,
      originalError: error,
    }));
  }
}
