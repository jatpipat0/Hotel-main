export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
  request_id?: string;
  details?: Array<{ field: string; issue: string }>;
}

export class ApiError extends Error {
  public status: number;
  public code: string;
  public requestId?: string;
  public details?: ApiErrorResponse['details'];

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.status = response.status;
    this.code = response.error;
    this.requestId = response.request_id;
    this.details = response.details;
  }

  isUnauthorized() { return this.status === 401; }
  isNotFound() { return this.status === 404; }
  isValidation() { return this.code === 'VALIDATION_ERROR'; }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const { timeoutMs = 10_000, ...fetchOptions } = options;

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchOptions.headers = { ...fetchOptions.headers, Authorization: `Bearer ${token}` };
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...fetchOptions.headers },
    });
    clearTimeout(timer);

    if (!res.ok) {
      let errorBody: ApiErrorResponse;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = { status: res.status, error: 'UNKNOWN_ERROR', message: `Server error (${res.status})` };
      }
      throw new ApiError(errorBody);
    }

    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;

  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError({ status: 503, error: 'TIMEOUT', message: 'Request timed out. Please try again.' });
    }
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new ApiError({ status: 503, error: 'NETWORK_ERROR', message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' });
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError({ status: 500, error: 'CLIENT_ERROR', message: 'An unexpected error occurred.' });
  }
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const map: Record<string, string> = {
      VALIDATION_ERROR: 'กรุณาตรวจสอบข้อมูลที่กรอก',
      DUPLICATE_KEY: 'อีเมลนี้ถูกใช้งานแล้ว',
      UNAUTHORIZED: 'กรุณาเข้าสู่ระบบก่อน',
      TOKEN_EXPIRED: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
      FORBIDDEN: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้',
      NOT_FOUND: 'ไม่พบข้อมูลที่ต้องการ',
      RATE_LIMITED: 'ส่งคำขอบ่อยเกินไป กรุณารอสักครู่',
      NETWORK_ERROR: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      TIMEOUT: 'การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่',
      INTERNAL_ERROR: 'เกิดข้อผิดพลาดภายใน กรุณาลองใหม่ภายหลัง',
    };
    return map[err.code] ?? err.message;
  }
  return 'เกิดข้อผิดพลาด กรุณาลองใหม่';
}