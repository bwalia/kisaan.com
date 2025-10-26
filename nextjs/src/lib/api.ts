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
    const response = await this.request(
      "/api/v2/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
    // If registration returns a token, store it immediately
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
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
    notes?: string;
    tracking_number?: string;
    tracking_url?: string;
    carrier?: string;
    estimated_delivery_date?: string;
  }) {
    return this.request(`/api/v2/orders/${orderId}/update-status`, {
      method: "PUT",
      body: JSON.stringify(statusData)
    }, true);
  }

  // Buyer Orders
  async getBuyerOrders() {
    return this.request("/api/v2/buyer/orders");
  }

  async getBuyerOrderDetails(orderId: string) {
    return this.request(`/api/v2/buyer/orders/${orderId}`);
  }

  async repeatOrder(orderId: string) {
    return this.request(`/api/v2/buyer/orders/${orderId}/repeat`, {
      method: "POST"
    });
  }

  async cancelOrder(orderId: string, reason?: string) {
    return this.request(`/api/v2/buyer/orders/${orderId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason })
    });
  }

  // Notifications
  async getNotifications(params?: { limit?: number; offset?: number; unread_only?: boolean }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/api/v2/notifications${query ? '?' + query : ''}`);
  }

  async markNotificationRead(notificationId: string) {
    return this.request(`/api/v2/notifications/${notificationId}/read`, {
      method: "PUT"
    });
  }

  async markAllNotificationsRead() {
    return this.request("/api/v2/notifications/mark-all-read", {
      method: "PUT"
    });
  }

  async deleteNotification(notificationId: string) {
    return this.request(`/api/v2/notifications/${notificationId}`, {
      method: "DELETE"
    });
  }

  // Public Store Profile
  async getPublicStoreProfile(slug: string) {
    return this.publicRequest(`/api/v2/public/stores/${slug}`);
  }

  async getPublicStoreProducts(slug: string, params?: {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
    sort?: 'created_at' | 'price_asc' | 'price_desc' | 'name';
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.publicRequest(`/api/v2/public/stores/${slug}/products${query ? '?' + query : ''}`);
  }

  async getPublicStoreReviews(slug: string, params?: { page?: number; per_page?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.publicRequest(`/api/v2/public/stores/${slug}/reviews${query ? '?' + query : ''}`);
  }

  async getPublicProductDetails(storeSlug: string, productId: string) {
    return this.publicRequest(`/api/v2/public/stores/${storeSlug}/products/${productId}`);
  }

  // Delivery Partner APIs
  async registerDeliveryPartner(data: any) {
    return this.request("/api/v2/delivery-partners/register", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  async getDeliveryPartnerProfile() {
    return this.request("/api/v2/delivery-partners/profile", { method: "GET" }, true);
  }

  async updateDeliveryPartnerProfile(data: any) {
    return this.request("/api/v2/delivery-partners/profile", {
      method: "PUT",
      body: JSON.stringify(data)
    }, true);
  }

  async addServiceArea(data: any) {
    return this.request("/api/v2/delivery-partners/areas", {
      method: "POST",
      body: JSON.stringify(data)
    }, true);
  }

  async searchDeliveryPartners(params: any) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/v2/delivery-partners/search?${query}`, { method: "GET" }, true);
  }

  async getDeliveryPartnersByArea(city: string, state: string, country?: string) {
    const params = new URLSearchParams({ city, state, ...(country && { country }) });
    return this.request(`/api/v2/delivery-partners/by-area?${params.toString()}`, { method: "GET" }, true);
  }

  // Delivery Assignment APIs
  async getDeliveryAssignments(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/api/v2/delivery-partner/assignments${query}`, { method: "GET" }, true);
  }

  async getDeliveryAssignment(uuid: string) {
    return this.request(`/api/v2/delivery-assignments/${uuid}`, { method: "GET" }, true);
  }

  async updateAssignmentStatus(uuid: string, data: any) {
    return this.request(`/api/v2/delivery-assignments/${uuid}/status`, {
      method: "PUT",
      body: JSON.stringify(data)
    }, true);
  }

  // Delivery Request APIs
  async createDeliveryRequest(data: any) {
    return this.request("/api/v2/delivery-requests", {
      method: "POST",
      body: JSON.stringify(data)
    }, true);
  }

  async getPartnerDeliveryRequests(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/api/v2/delivery-requests/partner${query}`, { method: "GET" }, true);
  }

  async getAllStoreDeliveryRequests(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/api/v2/delivery-requests/store${query}`, { method: "GET" }, true);
  }

  async acceptDeliveryRequest(uuid: string) {
    return this.request(`/api/v2/delivery-requests/${uuid}/accept`, {
      method: "PUT"
    }, true);
  }

  async rejectDeliveryRequest(uuid: string, reason?: string) {
    return this.request(`/api/v2/delivery-requests/${uuid}/reject`, {
      method: "PUT",
      body: JSON.stringify({ reason })
    }, true);
  }

  async cancelDeliveryRequest(uuid: string) {
    return this.request(`/api/v2/delivery-requests/${uuid}/cancel`, {
      method: "PUT"
    }, true);
  }

  // Delivery Partner Dashboard
  async getDeliveryPartnerDashboard() {
    return this.request("/api/v2/delivery-partner/dashboard", { method: "GET" }, true);
  }

  async getAvailableOrders(params?: any) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/api/v2/delivery-partner/available-orders${query}`, { method: "GET" }, true);
  }

  async getDeliveryEarnings(period?: string) {
    const query = period ? `?period=${period}` : '';
    return this.request(`/api/v2/delivery-partner/earnings${query}`, { method: "GET" }, true);
  }

  async getDeliveryPartnerEarnings(period?: string) {
    return this.getDeliveryEarnings(period);
  }

  // Delivery Partner Verification (Phone OTP)
  async sendVerificationOtp(phoneNumber: string) {
    return this.request("/api/v2/delivery-partners/verification/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber })
    });
  }

  async verifyDeliveryPartnerOtp(phoneNumber: string, otp: string) {
    return this.request("/api/v2/delivery-partners/verification/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber, otp: otp })
    });
  }

  // Store Delivery Partner Management
  async linkDeliveryPartnerToStore(storeSlug: string, deliveryPartnerUuid: string) {
    return this.request(`/api/v2/stores/${storeSlug}/delivery-partners`, {
      method: "POST",
      body: JSON.stringify({ delivery_partner_uuid: deliveryPartnerUuid })
    }, true);
  }

  async getStoreDeliveryPartners(storeSlug: string) {
    return this.request(`/api/v2/stores/${storeSlug}/delivery-partners`, { method: "GET" }, true);
  }

  async removeDeliveryPartnerFromStore(storeSlug: string, deliveryPartnerUuid: string) {
    return this.request(`/api/v2/stores/${storeSlug}/delivery-partners/${deliveryPartnerUuid}`, {
      method: "DELETE"
    }, true);
  }

  async setPreferredDeliveryPartner(storeSlug: string, deliveryPartnerUuid: string) {
    return this.request(`/api/v2/stores/${storeSlug}/delivery-partners/${deliveryPartnerUuid}/prefer`, {
      method: "PUT"
    }, true);
  }

  // Request to deliver an order (partner → seller)
  async requestOrderDelivery(data: { order_id: number; proposed_fee: number; message?: string }) {
    return this.request("/api/v2/delivery-partner/request-order", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  // Seller: Get delivery requests for store
  async getStoreDeliveryRequests(storeSlug: string) {
    return this.request(`/api/v2/delivery-requests/store/${storeSlug}`, {
      method: "GET"
    });
  }

}


export const api = new ApiClient(API_BASE_URL!);
export default api;
