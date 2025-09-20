const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function getBaseUrl() {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  return BASE_URL.replace(/\/+$/, "");
}

function getAuthHeaders() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit, auth = false): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
    ...(auth ? getAuthHeaders() : {}),
  } as Record<string, string>;

  const res = await fetch(url, {
    method: 'GET',
    ...init,
    headers,
    credentials: 'omit',
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
      else if (Array.isArray(data?.errors) && data.errors.length) message = data.errors[0].msg || message;
    } catch {}
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export const api = {
  auth: {
    login(payload: { email: string; password: string }) {
      return request<{ token: string; user: any }>("/api/auth/login", {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    register(payload: { name: string; email: string; password: string; role?: 'user' | 'admin' }) {
      return request<{ token: string; user: any }>("/api/auth/register", {
        method: 'POST',
        body: JSON.stringify({ ...payload, role: payload.role ?? 'user' }),
      });
    },
  },
  sweets: {
    list() {
      return request<any[]>("/api/sweets", undefined, true);
    },
    search(params: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) {
      const qs = new URLSearchParams();
      if (params.name) qs.set('name', params.name);
      if (params.category) qs.set('category', params.category);
      if (typeof params.minPrice === 'number') qs.set('minPrice', String(params.minPrice));
      if (typeof params.maxPrice === 'number') qs.set('maxPrice', String(params.maxPrice));
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return request<any[]>(`/api/sweets/search${suffix}`, undefined, true);
    },
    create(payload: { name: string; category: string; price: number; quantity: number; imageUrl?: string }) {
      return request<any>("/api/sweets", { method: 'POST', body: JSON.stringify(payload) }, true);
    },
    update(id: string, payload: Partial<{ name: string; category: string; price: number; quantity: number; imageUrl: string }>) {
      return request<any>(`/api/sweets/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, true);
    },
    delete(id: string) {
      return request<{ message: string }>(`/api/sweets/${id}`, { method: 'DELETE' }, true);
    },
  },
  inventory: {
    purchase(id: string, amount = 1) {
      return request<any>(`/api/sweets/${id}/purchase`, { method: 'POST', body: JSON.stringify({ amount }) }, true);
    },
    restock(id: string, amount: number) {
      return request<any>(`/api/sweets/${id}/restock`, { method: 'POST', body: JSON.stringify({ amount }) }, true);
    },
  },
};

export type { ApiError };
