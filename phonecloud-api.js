const BASE_URL = "https://phonecloud.dynns.com/public-api/v1";

class PhoneCloudApi {

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async _post(path, data = {}) {
    if (this.apiKey && !data.api_key) {
      data.api_key = this.apiKey;
    }
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return res.json();
      }
    }catch (e) {

    }
    throw new Error("Api Error!");
  }

  // 1. Danh sách thiết bị của user (party)
  listDevicePartyUser({ page = 1, limit = 10 } = {}) {
    return this._post("/device/list-device-party-user", { page, limit });
  }

  // 2. Tìm kiếm sản phẩm với party user
  searchProductWithPartyUser({ page = 1, limit = 10, classification = "DEVICE" } = {}) {
    return this._post("/product/search-with-party-user", { page, limit, classification });
  }

  // 3. Tạo order mới cho party
  createOrderForParty({ orders = [] }) {
    return this._post("/order/create-order-for-party", { orders });
  }

  // 4. Cập nhật order cho party
  updateOrderForParty({ orders = [] }) {
    return this._post("/order/update-order-for-party", { orders });
  }

  // 5. Lấy danh sách order trong cart
  listOrderInCartForParty({ }) {
    return this._post("/order/list-order-in-cart-for-party", {});
  }

  // 6. Thanh toán order
  paymentOrderParty({ order_ids = [] }) {
    return this._post("/order/payment-order-party", { order_ids });
  }

  // 7. Quản lý order (lọc danh sách order)
  manageOrderParty({ filter = [{ page: 1, limit: 10 }], type = "BUY" } = {}) {
    return this._post("/order/manage-order-party", { filter, type });
  }

  // 8. Gia hạn order
  renewOrderParty({ orders = [] }) {
    return this._post("/order/renew-order-party", { orders });
  }

  getNewIpRotateProxyParty(device) {
    const proxy = device.config_device.proxy;
    if (!proxy.api_key || proxy.api_key === ''){
      throw new Error("Proxy chưa được thêm vào!");
    }
    return this._post("/proxy-api-key/get-new-ip-rotate-proxy-party", {
      key_get_proxy: proxy.api_key,
      device_id: device.id,
      type_tcp: proxy.tcp_type,
      location_id: proxy.location.id,
      party: proxy.party
    });
  }
}