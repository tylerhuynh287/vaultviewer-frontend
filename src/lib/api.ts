import { auth } from "../firebase";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:5000";

async function getIdToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    return user.getIdToken();
}

type Options = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
};

async function request<T>(path: string, opts: Options = {}): Promise<T> {
    const token = await getIdToken();

    const res = await fetch(`${BASE_URL}${path}`, {
        method: opts.method || "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    if (res.status === 401) {
        throw new Error("Unauthorized");
    }

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
}

export const api = {
    getBins: () => request<{ success: boolean; bins: any[] }>("/api/bins"),
    createBin: (name: string) =>
        request<{ success: boolean; binId: string }>("/api/bins", {
            method: "POST",
            body: { name },
        }),
    getItems: (binId: string) =>
        request<{ success: boolean; items: any[] }>(`/api/items/${binId}`),
    createItem: (binId: string, payload: { name: string; category?: string; quantity?: number; notes?: string }) =>
        request<{ success: boolean; itemId: string }>(`/api/items/${binId}`, {
            method: "POST",
            body: payload,
        }),
    updateItem: (binId: string, itemId: string, payload: any) =>
        request<{ success: boolean }>(`/api/items/${binId}/${itemId}`, {
            method: "PUT",
            body: payload,
        }),
    deleteItem: (binId: string, itemId: string) =>
        request<{ success: boolean }>(`/api/items/${binId}/${itemId}`, {
            method:"DELETE",
        }),
};