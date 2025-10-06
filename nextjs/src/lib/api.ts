const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  private async request(
    endpoint: string,
    options: RequestInit = {},
    useFormData = false
  ) {
    const url = `${this.baseURL}${endpoint}`;

    let body = options.body;
    let headers: any = {
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    if (useFormData && options.body && typeof options.body === "string") {
      const data = JSON.parse(options.body);
      body = new URLSearchParams(data).toString();
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else if (!useFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, { ...options, headers, body });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  private async publicRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers: any = {
      "Content-Type": "application/json",
      "X-Public-Browse": "true",
      ...options.headers,
    };

    // Include Authorization header if token exists (for authenticated browsing)
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  // Auth
  async register(data: any) {
    return this.request(
      "/api/v2/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async login(data: any) {
    const response = await this.request(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    return this.request(
      "/auth/logout",
      {
        method: "POST",
        body: JSON.stringify({}),
      },
      true
    );
  }

  // OAuth methods
  async validateOAuthToken(token: string) {
    return this.request(
      "/auth/oauth/validate",
      {
        method: "POST",
        body: JSON.stringify({ token }),
      },
      true
    );
  }

  getGoogleAuthUrl(redirectPath?: string) {
    const params = new URLSearchParams();
    if (redirectPath) {
      params.append("from", redirectPath);
    }
    return `${this.baseURL}/auth/google?${params}`;
  }

  getFacebookAuthUrl(redirectPath?: string) {
    const params = new URLSearchParams();
    if (redirectPath) {
      params.append("from", redirectPath);
    }
    return `${this.baseURL}/auth/facebook?${params}`;
  }

  // Products (public access)
  async getProducts(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return this.publicRequest(`/api/v2/products${query}`);
  }

  // Enhanced product search
  async searchProducts(searchParams: {
    search?: string;
    category_id?: string;
    store_id?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
    page?: number;
    perPage?: number;
    orderBy?: string;
    orderDir?: "asc" | "desc";
  }) {
    const query = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value.toString());
      }
    });
    return this.publicRequest(`/api/v2/products?${query}`);
  }

  // Get featured products
  async getFeaturedProducts(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return this.publicRequest(`/api/v2/products/featured${query}`);
  }

  // Get single product
  async getProduct(productId: string) {
    return this.publicRequest(`/api/v2/products/${productId}`);
  }

  async getStoreProducts(storeId: string, params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return this.publicRequest(
      `/api/v2/products?store_id=${storeId}${query ? `&${query}` : ""}`
    );
  }

  // Cart
  async getCart() {
    return this.request("/api/v2/cart", { method: "GET" });
  }
  async getCartTotals() {
    return this.request("/api/v2/cart/totals", { method: "GET" });
  }

  async addToCart(data: any) {
    return this.request(
      "/api/v2/cart/add",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async removeFromCart(productId: string) {
    return this.request(`/api/v2/cart/remove/${productId}`, {
      method: "DELETE",
    });
  }

  async clearCart() {
    return this.request("/api/v2/cart/clear", {
      method: "DELETE",
    });
  }

  async debugCart() {
    return this.request("/api/v2/cart/debug", { method: "GET" });
  }

  // Checkout
  async checkout(data: any) {
    return this.request(
      "/api/v2/checkout",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  // Stripe Payments
  async createPaymentIntent(data: any) {
    return this.request(
      "/api/v2/payments/create-intent",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async createCheckoutSession(data: any) {
    return this.request(
      "/api/v2/payments/create-checkout-session",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async confirmPayment(data: any) {
    return this.request(
      "/api/v2/payments/confirm",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  // Stores (public access for GET)
  async getStores(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return this.publicRequest(`/api/v2/stores${query}`);
  }

  // Get user's own stores (authenticated)
  async getMyStores(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/api/v2/my/stores${query}`);
  }

  async createStore(data: any) {
    return this.request(
      "/api/v2/stores",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  // Categories
  async getCategories(storeId?: string) {
    const query = storeId ? `?store_id=${storeId}` : "";
    return this.publicRequest(`/api/v2/categories${query}`);
  }

  async createCategory(data: any) {
    return this.request(
      "/api/v2/categories",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async updateCategory(id: string, data: any) {
    return this.request(
      `/api/v2/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async deleteCategory(id: string) {
    return this.request(`/api/v2/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Search categories by name within a store
  async searchCategories(params: {
    store_id: string;
    search?: string;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value.toString());
      }
    });
    return this.request(`/api/v2/categories/search?${query}`);
  }

  // Check if category name exists in store
  async checkCategoryExists(storeId: string, name: string) {
    const query = new URLSearchParams({
      store_id: storeId,
      name: name
    });
    return this.request(`/api/v2/categories/check?${query}`);
  }

  // Products
  async createProduct(storeId: string, data: any) {
    data.store_id = storeId;
    return this.request(
      `/api/v2/products`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async updateProduct(productId: string, data: any) {
    return this.request(
      `/api/v2/products/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async deleteProduct(productId: string) {
    return this.request(`/api/v2/products/${productId}`, {
      method: "DELETE",
    });
  }

  async getStore(storeId: string) {
    return this.request(`/api/v2/stores/${storeId}`, { method: "GET" });
  }

  async getVariants(productId: string) {
    return this.publicRequest(`/api/v2/products/${productId}/variants`, {
      method: "GET",
    });
  }

  async createVariant(productId: string, data: any) {
    return this.request(
      `/api/v2/products/${productId}/variants`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async updateVariant(variantId: string, data: any) {
    return this.request(
      `/api/v2/variants/${variantId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async deleteVariant(variantId: string) {
    return this.request(`/api/v2/variants/${variantId}`, {
      method: "DELETE",
    });
  }

  async updateStore(storeId: string, data: any) {
    return this.request(
      `/api/v2/stores/${storeId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async deleteStore(storeId: string) {
    return this.request(`/api/v2/stores/${storeId}`, {
      method: "DELETE",
    });
  }

  // Orders
  async getStoreOrders(storeId: string, params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/api/v2/stores/${storeId}/orders${query}`);
  }

  async getOrderDetails(orderId: string) {
    return this.request(`/api/v2/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: string, statusData: {
    status?: string;
    financial_status?: string;
    fulfillment_status?: string;
    internal_notes?: string;
  }) {
    return this.request(`/api/v2/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify(statusData)
    }, true);
  }
}

export const api = new ApiClient(API_BASE_URL!);
export default api;
