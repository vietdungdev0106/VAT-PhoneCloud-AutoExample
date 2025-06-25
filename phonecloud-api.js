const BASE_URL = "https://phonecloud.dynns.com/public-api/v1";

class PhoneCloudApi {

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async _post(path, data = {}) {
    // Tự động chèn api_key nếu chưa có
    if (this.apiKey && !data.api_key) data.api_key = this.apiKey;

    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} - ${text}`);
    }
    return res.json();
  }

  // 1. Danh sách thiết bị của user (party)
  listDevicePartyUser({ api_key, page = 1, limit = 10 } = {}) {
    return this._post("/device/list-device-party-user", { page, limit, api_key });
  }

  // 2. Tìm kiếm sản phẩm với party user
  searchProductWithPartyUser({ api_key, page = 1, limit = 10, classification = "DEVICE" } = {}) {
    return this._post("/product/search-with-party-user", { page, limit, classification, api_key });
  }

  // 3. Tạo order mới cho party
  createOrderForParty({ api_key, orders = [] }) {
    return this._post("/order/create-order-for-party", { orders, api_key });
  }

  // 4. Cập nhật order cho party
  updateOrderForParty({ api_key, orders = [] }) {
    return this._post("/order/update-order-for-party", { orders, api_key });
  }

  // 5. Lấy danh sách order trong cart
  listOrderInCartForParty({ api_key }) {
    return this._post("/order/list-order-in-cart-for-party", { api_key });
  }

  // 6. Thanh toán order
  paymentOrderParty({ api_key, order_ids = [] }) {
    return this._post("/order/payment-order-party", { order_ids, api_key });
  }

  // 7. Quản lý order (lọc danh sách order)
  manageOrderParty({ api_key, filter = [{ page: 1, limit: 10 }], type = "BUY" } = {}) {
    return this._post("/order/manage-order-party", { api_key, filter, type });
  }

  // 8. Gia hạn order
  renewOrderParty({ api_key, orders = [] }) {
    return this._post("/order/renew-order-party", { api_key, orders });
  }

  async getProxyFromApiKey(apiKey) {
    for (let i = 0; i < 60; i++) {
      try {
        const res = await fetch(`https://api.allorigins.win/raw?url=https://proxyxoay.org/api/get.php?key=${apiKey}&nhamang=Random&&tinhthanh=0`);
        if (!res.ok) {
          continue;
        }
        const body = await res.json();
        const proxySocks5 = body.proxysocks5;
        const proxyArr = proxySocks5.split(':');
        
        return {
          type: "socks5",
          host: proxyArr[0],
          port: parseInt(proxyArr[1]),
          username: proxyArr[2],
          password: proxyArr[3]
        }
      } catch (e) {
        // tiếp tục thử proxy khác
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error("Không thể lấy proxy!");
  }
}