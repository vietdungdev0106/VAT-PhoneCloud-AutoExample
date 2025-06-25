class PhoneCloudActions {

   constructor(ws, deviceId) {
      this.ws = ws;
      this.deviceId = deviceId;
   }


   /**
   * SLEEP (Tạm nghỉ một khoảng thời gian và tiếp tục ngay sau đó)
   * 
   * @param {number} time - Thời gian tạm ngưng dưới dạng milliseconds.
   * 
   * @example
   * await sleep(1000);
   */
   sleep(time = 5000) {
      return new Promise(resolve => setTimeout(resolve, time));
   }

   /**
   * RANDOM NUMBER (Tạo số nguyên ngẫu nhiên trong khoảng [start, end])
   * 
   * @param {number} start - Giá trị bắt đầu (bao gồm)
   * @param {number} end - Giá trị kết thúc (bao gồm)
   * 
   * @returns {number} - Số nguyên ngẫu nhiên trong khoảng
   * 
   * @example
   * randomNumber(1000, 2000);
   */
   randomNumber(start, end) {
      return Math.floor(Math.random() * (end - start + 1)) + start;
   }

   /**
    * RANDOM STRING (Sinh chuỗi ngẫu nhiên với các tuỳ chọn về độ dài và ký tự)
    * 
    * @param {number} startLen   - Độ dài tối thiểu
    * @param {number} endLen     - Độ dài tối đa
    * @param {Object} options
    *   @param {boolean} [options.hasNumber]         - Có số hay không (mặc định: true)
    *   @param {boolean} [options.hasUpperCase]      - Có chữ in hoa hay không (mặc định: true)
    *   @param {boolean} [options.hasSpecialChar]    - Có ký tự đặc biệt hay không (mặc định: false)
    * 
    * @returns {string} Chuỗi ngẫu nhiên
    * 
    * @example
    * randomString(10, 15, {hasNumber: true, hasUpperCase: false, hasSpecialChar: false});
   */
   randomString(startLen, endLen = startLen, options = {}) {
      const {
         hasNumber = true,
         hasUpperCase = true,
         hasSpecialChar = false,
      } = options;

      let chars = 'abcdefghijklmnopqrstuvwxyz'; // chữ thường

      if (hasUpperCase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (hasNumber) chars += '0123456789';
      if (hasSpecialChar) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?/~';

      if (chars.length === 0) return '';

      // Random length trong khoảng [startLen, endLen]
      const length = Math.floor(Math.random() * (endLen - startLen + 1)) + startLen;
      let result = '';
      for (let i = 0; i < length; i++) {
         result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
   }

   /**
   * OPEN APP (Mở ứng dụng trên thiết bị bằng package name.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần sử dụng.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái đã được mở thành công hay thất bại
   *
   * @example
   * await openApp("com.facebook.katana");
   */
   openApp(packageName, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "open_app", {package_name: packageName}, timeout);
   }


   /**
   * OPEN APP DEEPLINK (Mở ứng dụng trên thiết bị thông qua package name và deeplink URL.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần sử dụng.
   * @param {string} url - Đường dẫn deeplink cần mở trong ứng dụng.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái đã được mở thành công hay thất bại
   *
   * @example
   * await openAppDeeplink("com.facebook.katana", "fb://profile/4");
   */
   openAppDeeplink(packageName, url, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "open_app_deep_link", {package_name: packageName, url: url}, timeout);
   }


   /**
   * CHECK APP INSTALLED (Kiểm tra ứng dụng với package name chỉ định đã được cài đặt trên thiết bị hay chưa.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần sử dụng.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái ứng dụng đã được cài đặt hay chưa
   *
   * @example
   * await checkAppInstalled("com.facebook.katana");
   */
   checkAppInstalled(packageName, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_app_installed", {package_name: packageName}, timeout);
   }


   /**
   * CHECK APP ENABLED (Kiểm tra ứng dụng với package name chỉ định có đang được bật (enabled) trên thiết bị không.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần sử dụng.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái ứng dụng đã được bật hay chưa
   *
   * @example
   * await checkAppEnabled("com.facebook.katana");
   */
   checkAppEnabled(packageName, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_app_enabled", {package_name: packageName}, timeout);
   }


   /**
   * CHECK APP SYSTEM (Kiểm tra ứng dụng với package name chỉ định có phải là ứng dụng hệ thống hay không.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần sử dụng.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái ứng dụng là ứng dụng hệ thống hay không.
   *
   * @example
   * await checkAppSystem("com.facebook.katana");
   */
   checkAppSystem(packageName, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_app_system", {package_name: packageName}, timeout);
   }


   /**
   * CHECK APP RUNNING (Kiểm tra ứng dụng với package name chỉ định có đang chạy trên thiết bị không.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần sử dụng.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái ứng dụng có đang hoạt động hay không.
   *
   * @example
   * await checkAppRunning("com.facebook.katana");
   */
   checkAppRunning(packageName, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_app_running", {package_name: packageName}, timeout);
   }


   /**
   * CHECK APP PERMISSION GRANTED (Kiểm tra xem ứng dụng với package name chỉ định đã được cấp quyền cụ thể hay chưa.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần sử dụng.
   * @param {string} permission - Tên quyền Android cần kiểm tra.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái quyền đó có được cho phép sử dụng hay không.
   *
   * @example
   * await checkAppPermissionGranted("com.facebook.katana", "android.permission.CAMERA");
   */
   checkAppPermissionGranted(packageName, permission, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_app_permission_granted", {package_name: packageName, permission: permission}, timeout);
   }


   /**
   * GET APPLICATION INSTALLED (Lấy danh sách tất cả các ứng dụng đã cài đặt trên thiết bị.)
   *
   * @param {string} type - Loại ứng dụng cần lấy: "ALL" (tất cả), "USER" (ứng dụng người dùng cài), "SYSTEM" (ứng dụng hệ thống).
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {array} - Danh sách ứng dụng theo loại mà bạn yêu cầu được cài đặt trên thiết bị.
   *
   * @example
   * await getApplicationInstalled("USER");
   */
   getApplicationInstalled(type, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "get_app_installed", {type: type}, timeout);
   }


   /**
   * GET APP NAME (Lấy tên hiển thị của ứng dụng dựa trên package name.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần sử dụng.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {string} - Tên của ứng dụng nếu đã được cài đặt trên thiết bị.
   *
   * @example
   * await getAppName("com.facebook.katana");
   */
   getAppName(packageName, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "get_app_name", {package_name: packageName}, timeout);
   }


   /**
   * GET APP VERSION CODE (Lấy version code (số hiệu phiên bản) của ứng dụng dựa trên package name.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần sử dụng.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {number} - Số hiệu phiên bản của ứng dụng
   *
   * @example
   * await getAppVersionCode("com.facebook.katana");
   */
   getAppVersionCode(packageName, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "get_app_version_code", {package_name: packageName}, timeout);
   }


   /**
   * GET APP VERSION NAME (Lấy version name (tên phiên bản) của ứng dụng dựa trên package name.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần sử dụng.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {string} - Tên phiên bản của ứng dụng
   *
   * @example
   * await getAppVersionName("com.facebook.katana");
   */
   getAppVersionName(packageName, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "get_app_version_name", {package_name: packageName}, timeout);
   }


   /**
   * GET TOP ACTIVITY INFO (Lấy thông tin activity đang hiển thị trên cùng (top activity) trên thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Thông tin Activity hiển thị trên cùng của màn hình 
   *
   * @example
   * await getTopActivityInfo();
   */
   getTopActivityInfo(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "get_top_activity_info", {}, timeout);
   }


   /**
   * GET WEBVIEW PAGE SOURCE (Lấy mã nguồn HTML của trang đang hiển thị trong WebView ở activity trên cùng.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Thông tin chi tiết của WebView bao gồm: url, title, html,...
   *
   * @example
   * await getWebviewPageSource();
   */
   getWebviewPageSource(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "get_webview_page_source", {}, timeout);
   }


   /**
   * EVALUATE JAVASCRIPT IN WEBVIEW (Thực thi một đoạn JavaScript trên trang hiện tại của WebView thuộc activity đang hiển thị trên cùng.)
   *
   * @param {string} javascript - Đoạn mã JavaScript cần thực thi.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {string} - Kết quả mà lệnh javascript đã thực thi.
   *
   * @example
   * await evaluateJavascriptInWebview("document.title");
   */
   evaluateJavascriptInWebview(javascript, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "evaluate_javascript_in_webview", {javascript: javascript}, timeout);
   }


   /**
   * GO TO URL IN WEBVIEW  (Chuyển WebView trên cùng tới một URL mới.)
   *
   * @param {string} url - Địa chỉ web (URL) cần mở trên WebView.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái mở url thành công hay không.
   *
   * @example
   * await goToUrlInWebview("https://www.google.com");
   */
   goToUrlInWebview(url, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "go_to_url_in_webview", {url: url}, timeout);
   }


   /**
   * RELOAD PAGE IN WEBVIEW (Làm mới (reload) trang hiện tại trên WebView đang hiển thị trên cùng.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái làm mới trang web thành công hay không.
   *
   * @example
   * await reloadPageInWebview();
   */
   reloadPageInWebview(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "reload_page_in_webview", {}, timeout);
   }


   /**
   * GO BACK IN WEBVIEW (Quay lại trang trước trên WebView hiện tại của activity top.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái quay lại trang trước thành công hay không.
   *
   * @example
   * await goBackInWebview();
   */
   goBackInWebview(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "go_back_in_webview", {}, timeout);
   }


   /**
   * GO FORWARD IN WEBVIEW (Đi tới trang tiếp theo (nếu có) trên WebView hiện tại của activity top.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái đi tới trang sau thành công hay không.
   *
   * @example
   * await goForwardInWebview();
   */
   goForwardInWebview(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "go_forward_in_webview", {}, timeout);
   }


   /**
   * CHECK WIFI ENABLED (Kiểm tra thiết bị có đang kết nối Wi-Fi không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái wifi có được bật hay không.
   *
   * @example
   * await checkWifiEnabled();
   */
   checkWifiEnabled(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_wifi_enabled", {}, timeout);
   }


   /**
   * CHECK MOBILE DATA ENABLED (Kiểm tra thiết bị có đang sử dụng kết nối dữ liệu di động (3G/4G/5G) không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái kết nối di động có được bật hay không.
   *
   * @example
   * await checkMobileDataEnabled();
   */
   checkMobileDataEnabled(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_mobile_data_enabled", {}, timeout);
   }


   /**
   * CHECK POWER CONNECTED (Kiểm tra thiết bị có đang được cắm sạc điện không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái pin có được sạc hay không.
   *
   * @example
   * await checkPowerConnected();
   */
   checkPowerConnected(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_power_connected", {}, timeout);
   }


   /**
   * CHECK AIRPLANE MODE ENABLED (Kiểm tra chế độ máy bay trên thiết bị có đang được bật không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái chế độ máy bay có được bật hay không.
   *
   * @example
   * await checkAirplaneModeEnabled();
   */
   checkAirplaneModeEnabled(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_airplane_mode_enabled", {}, timeout);
   }


   /**
   * CHECK VPN ENABLED (Kiểm tra thiết bị có đang kết nối VPN không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái VPN có được bật hay không.
   *
   * @example
   * await checkVpnEnabled();
   */
   checkVpnEnabled(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_vpn_enabled", {}, timeout);
   }


   /**
   * CHECK SIM CARD EXISTS (Kiểm tra thiết bị có lắp SIM card không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái Sim Card có được hoạt động hay không.
   *
   * @example
   * await checkSimCardExists();
   */
   checkSimCardExists(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_sim_card_exists", {}, timeout);
   }


   /**
   * CHECK GPS ENABLED (Kiểm tra tính năng GPS (định vị) trên thiết bị có đang bật không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái GPS có được bật hay không.
   *
   * @example
   * await checkGpsEnabled();
   */
   checkGpsEnabled(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_gps_enabled", {}, timeout);
   }


   /**
   * CHECK USB DEBUG ENABLED (Kiểm tra chế độ USB Debugging trên thiết bị có đang được bật không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái gỡ lỗi USB có được bật hay không.
   *
   * @example
   * await checkUsbDebugEnabled();
   */
   checkUsbDebugEnabled(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_usb_debug_enabled", {}, timeout);
   }


   /**
   * CHECK ADB ENABLED (Kiểm tra chức năng ADB (Android Debug Bridge) trên thiết bị có đang được bật không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái ADB có được bật hay không.
   *
   * @example
   * await checkAdbEnabled();
   */
   checkAdbEnabled(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_adb_enabled", {}, timeout);
   }


   /**
   * CHECK ADB RUNNING (Kiểm tra tiến trình ADB trên thiết bị có đang chạy không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái ADB có đang hoạt động hay không.
   *
   * @example
   * await checkAdbRunning();
   */
   checkAdbRunning(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_adb_running", {}, timeout);
   }


   /**
   * CHECK ROOTED (Kiểm tra thiết bị có đang root (đã can thiệp hệ thống) hay không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái quyền Root có trên thiết bị hay không.
   *
   * @example
   * await checkRooted();
   */
   checkRooted(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_rooted", {}, timeout);
   }


   /**
   * GET CLIPBOARD (Lấy nội dung hiện tại của clipboard (bộ nhớ tạm) trên thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {string} - Nội dung hiện tại của bộ nhớ tạm.
   *
   * @example
   * await getClipboard();
   */
   getClipboard(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "get_clipboard", {}, timeout);
   }


   /**
   * SET CLIPBOARD (Gán giá trị cho clipboard (bộ nhớ tạm) trên thiết bị.)
   *
   * @param {string} content - Chuỗi nội dung muốn đặt vào clipboard (có thể là bất kỳ văn bản nào).
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái gán nội dung vào bộ nhớ tạm thành công hay không.
   *
   * @example
   * await setClipboard("VAT-PhoneCloud kính chào!");
   */
   setClipboard(content, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "set_clipboard", {content: content}, timeout);
   }


   /**
   * SET WIFI ENABLED (Bật hoặc tắt Wi-Fi trên thiết bị.)
   *
   * @param {boolean} enabled - Trạng thái mong muốn của Wi-Fi: true (bật), false (tắt).
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái bật/tắt thành công hay không.
   *
   * @example
   * await setWifiEnabled(true);
   */
   setWifiEnabled(enabled, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "set_wifi_enabled", {enabled: enabled}, timeout);
   }


   /**
   * CONNECT WIFI (Kết nối đến một mạng Wi-Fi với SSID và mật khẩu chỉ định.)
   *
   * @param {string} ssid - Tên mạng Wi-Fi cần kết nối (SSID).
   * @param {string} password - Mật khẩu mạng Wi-Fi, để trống nếu mạng không có mật khẩu.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái kết nối thành công hay không.
   *
   * @example
   * await connectWifi("VAT-Software", "12345678");
   */
   connectWifi(ssid, password, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "connect_wifi", {ssid: ssid, password: password}, timeout);
   }


   /**
   * INSTALL APP (Cài đặt ứng dụng lên thiết bị từ đường dẫn file APK.)
   *
   * @param {string} file_path - Đường dẫn đến tệp ứng dụng (.apk) trên thiết bị cần cài đặt.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái cài đặt ứng dụng thành công hay không.
   *
   * @example
   * await installApp("/sdcard/base.apk");
   */
   installApp(filePath, timeout = 30000) {
      return this.ws.sendActionToDevice(this.deviceId, "install_app", {file_path: filePath}, timeout);
   }


   /**
   * INSTALL APP FROM URL (Cài đặt ứng dụng lên thiết bị từ liên kết tải xuống.)
   *
   * @param {string} url - Địa chỉ URL đến file APK cần cài đặt.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái cài đặt ứng dụng thành công hay không.
   *
   * @example
   * await installAppFromUrl("/sdcard/base.apk");
   */
   installAppFromUrl(url, timeout = 60000) {
      return this.ws.sendActionToDevice(this.deviceId, "install_app_from_url", {url: url}, timeout);
   }


   /**
   * CLEAR APP DATA (Xóa toàn bộ dữ liệu của ứng dụng với package name chỉ định trên thiết bị.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần xóa dữ liệu.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái xóa dữ liệu thành công hay thất bại
   *
   * @example
   * await clearAppData("com.facebook.katana");
   */
   clearAppData(packageName, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "clear_app_data", {package_name: packageName}, timeout);
   }


   /**
   * FORCE STOP APP (Tạm dừng (force stop) ứng dụng với package name chỉ định trên thiết bị.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần dừng hoạt động.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái dừng hoạt động ứng dụng thành công hay thất bại
   *
   * @example
   * await forceStopApp("com.facebook.katana");
   */
   forceStopApp(packageName, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "force_stop_app", {package_name: packageName}, timeout);
   }


   /**
   * UNINSTALL APP (Gỡ cài đặt ứng dụng với package name chỉ định khỏi thiết bị.)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn cần gỡ cài đặt.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái gỡ cài đặt ứng dụng thành công hay thất bại
   *
   * @example
   * await uninstallApp("com.facebook.katana");
   */
   uninstallApp(packageName, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "uninstall_app", {package_name: packageName}, timeout);
   }


   /**
   * BACK (Thực hiện thao tác quay lại (Back) trên thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái trở về hoạt động trước đó thành công hay thất bại
   *
   * @example
   * await back();
   */
   back(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "back", {}, timeout);
   }


   /**
   * HOME (Thực hiện thao tác về màn hình chính (Home) trên thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái trở về màn hình chính thành công hay thất bại
   *
   * @example
   * await home();
   */
   home(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "home", {}, timeout);
   }


   /**
   * RECENT (Hiển thị danh sách các ứng dụng gần đây (Recent Apps) trên thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái cửa sổ đa nhiệm thành công hay thất bại
   *
   * @example
   * await recent();
   */
   recent(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "recent", {}, timeout);
   }


   /**
   * POWER (Mở menu nguồn hoặc thực hiện thao tác nguồn trên thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái menu nguồn thành công hay thất bại
   *
   * @example
   * await power();
   */
   power(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "power", {}, timeout);
   }


   /**
   * LOCKSCREEN (Khóa màn hình thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái khóa màn hình thiết bị thành công hay thất bại
   *
   * @example
   * await lockscreen();
   */
   lockscreen(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "lockscreen", {}, timeout);
   }


   /**
   * NOTIFICATION (Mở bảng thông báo trên thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái mở thanh thông báo thành công hay thất bại
   *
   * @example
   * await notification();
   */
   notification(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "notification", {}, timeout);
   }


   /**
   * KEYBOARD INPUT TEXT (Nhập một chuỗi ký tự vào trường nhập liệu hiện tại thông qua bàn phím.)
   *
   * @param {string} content - Nội dung mà bạn muốn điền vào bằng bàn phím.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái đã điền nội dung thành công hay thất bại
   *
   * @example
   * await keyboardInputText("VAT-PhoneCloud ProVip!");
   */
   keyboardInputText(content, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "keyboard_input_text", {content: content}, timeout);
   }


   /**
   * KEYBOARD APPEND TEXT (Thêm một chuỗi ký tự vào cuối trường nhập liệu hiện tại thông qua bàn phím.)
   *
   * @param {string} content - Nội dung mà bạn muốn nối thêm vào bằng bàn phím.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái đã nối thêm nội dung thành công hay thất bại
   *
   * @example
   * await keyboardAppendText("VAT-PhoneCloud ProVip!");
   */
   keyboardAppendText(content, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "keyboard_append_text", {content: content}, timeout);
   }


   /**
   * KEYBOARD GET TEXT (Lấy toàn bộ văn bản trong trường nhập liệu hiện tại.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {string} - Nội dung văn bản mà bàn phím có thể lấy trên màn hình.
   *
   * @example
   * await keyboardGetText();
   */
   keyboardGetText(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "keyboard_get_text", {}, timeout);
   }


   /**
   * KEYBOARD GET SELECTION TEXT (Lấy đoạn văn bản đang được chọn trong trường nhập liệu.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {string} - Nội dung văn bản đang được chọn (selected) mà bàn phím có thể lấy trên màn hình.
   *
   * @example
   * await keyboardGetSelectionText();
   */
   keyboardGetSelectionText(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "keyboard_get_selection_text", {}, timeout);
   }


   /**
   * KEYBOARD GET SELECTION (Lấy vị trí bắt đầu và kết thúc đoạn được chọn trong trường nhập liệu.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Vị trí của văn bản đang được chọn trên màn hình.
   *
   * @example
   * await keyboardGetSelection();
   */
   keyboardGetSelection(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "keyboard_get_selection", {}, timeout);
   }


   /**
   * KEYBOARD SET SELECTION (Đặt vị trí con trỏ (và vùng chọn nếu có) trong ô nhập văn bản hiện tại.)
   *
   * @param {number} start - Vị trí bắt đầu của văn bản được chọn.
   * @param {number} end - Vị trí kết thúc của văn bản được chọn.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái gán vị trí chọn văn bản thành công hay thất bại
   *
   * @example
   * await keyboardSetSelection(1, 10);
   */
   keyboardSetSelection(start, end, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "keyboard_set_selection", {start: start, end: end}, timeout);
   }


   /**
   * KEYBOARD CLEAR TEXT (Xóa toàn bộ nội dung trong ô nhập văn bản hiện tại.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái xóa văn bản thành công hay thất bại
   *
   * @example
   * await keyboardClearText();
   */
   keyboardClearText(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "keyboard_clear_text", {}, timeout);
   }


   /**
   * KEYBOARD IS SHOWN (Kiểm tra bàn phím ảo có đang hiển thị trên thiết bị không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái bàn phím có đăng mở hay tắt.
   *
   * @example
   * await keyboardIsShown();
   */
   keyboardIsShown(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "keyboard_is_shown", {}, timeout);
   }


   /**
   * MOUSE CLICK (Thực hiện thao tác nhấp chuột (hoặc chạm) tại vị trí chỉ định trên màn hình.)
   *
   * @param {string} type - Loại tọa độ cần click: "RATIO" (click theo tỉ lệ), "COORDINATE" (click theo vị trí tọa độ).
   * @param {number} x - Vị trí tọa độ theo trục x (Trục hoành).
   * @param {number} y - Vị trí tọa độ theo trục y (Trục tung).
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái click thành công hay thất bại
   *
   * @example
   * await mouseClick("COORDINATE", 150, 150);
   */
   mouseClick(type, x, y, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "mouse_click", {type: type, x: x, y: y}, timeout);
   }


   /**
   * MOUSE SWIPE (Thực hiện thao tác vuốt chuột (hoặc vuốt cảm ứng) từ vị trí này tới vị trí khác trên màn hình.)
   *
   * @param {string} type - Loại tọa độ cần vuốt: "RATIO" (click theo tỉ lệ), "COORDINATE" (click theo vị trí tọa độ).
   * @param {number} x1 - Vị trí tọa bắt đầu vuốt theo trục x1 (Trục hoành).
   * @param {number} y1 - Vị trí tọa bắt đầu vuốt theo trục y (Trục tung).
   * @param {number} x2 - Vị trí tọa kết thúc vuốt theo trục x1 (Trục hoành).
   * @param {number} y2 - Vị trí tọa kết thúc vuốt theo trục y (Trục tung).
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái vuốt thành công hay thất bại
   *
   * @example
   * await mouseSwipe("COORDINATE", 150, 150, 150, 150);
   */
   mouseSwipe(type, x1, y1, x2, y2, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "mouse_swipe", {type: type, x1: x1, y1: y1, x2: x2, y2: y2}, timeout);
   }


   /**
   * SCROLL FORWARD (Cuộn nội dung về phía trước trong giao diện hiện tại.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái cuộn lên công hay thất bại
   *
   * @example
   * await scrollForward();
   */
   scrollForward(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "scroll_forward", {}, timeout);
   }


   /**
   * SCROLL BACKWARD (Thực hiện thao tác cuộn ngược (scroll backward) trên màn hình hiện tại.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái cuộn xuống công hay thất bại
   *
   * @example
   * await scrollBackward();
   */
   scrollBackward(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "scroll_backward", {}, timeout);
   }


   /**
   * TAKE SCREENSHOT (Chụp ảnh màn hình hiện tại của thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {string} - Nội dung hình ảnh chụp màn hình dưới dạng base64.
   *
   * @example
   * await takeScreenshot();
   */
   takeScreenshot(timeout = 10000) {
      return this.ws.sendActionToDevice(this.deviceId, "take_screenshot", {}, timeout);
   }


   /**
   * TAKE SCREENSHOT TO FILE (Chụp ảnh màn hình hiện tại của thiết bị.)
   *
   * @param {string} file_path - Đường dẫn ảnh chụp màn hình mà bạn muốn lưu trên thiết bị.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái chụp màn hình và lưu vào tệp thành công hay thất bại
   *
   * @example
   * await takeScreenshotToFile("/sdcard/screenshot_image.jpeg");
   */
   takeScreenshotToFile(filePath, timeout = 10000) {
      return this.ws.sendActionToDevice(this.deviceId, "take_screenshot_to_file", {file_path: filePath}, timeout);
   }


   /**
   * DUMP SCREEN XML (Lấy cấu trúc giao diện hiện tại của màn hình dưới dạng XML (UI hierarchy dump).)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {string} - Nội dung giao diện màn hình hiện tại dưới dạng XML (UI hierarchy dump).
   *
   * @example
   * await dumpScreenXml();
   */
   dumpScreenXml(timeout = 10000) {
      return this.ws.sendActionToDevice(this.deviceId, "dump_screen_xml", {}, timeout);
   }


   /**
   * FIND NODE (Tìm kiếm một node (phần tử giao diện) trên màn hình dựa trên từ khóa, loại thuộc tính và vị trí.)
   *
   * @param {string} type - Loại thuộc tính cần tìm: "XPATH", "TEXT", "DESCRIPTION", "RESOURCE_ID", "CLASS_NAME", "TEXT_OR_DESCRIPTION".
   * @param {string} keyword - Từ khóa tìm kiếm.
   * @param {number} position - Vị trí node trong danh sách kết quả tìm được (bắt đầu từ 0). Dùng khi có nhiều node trùng điều kiện.
   * @param {object} retry - Cấu hình thử lại khi chưa tìm thấy node.
   * @param {number} retry.count - Số lần thử lại tối đa nếu chưa tìm thấy node.
   * @param {number} retry.after_ms - Thời gian chờ (ms) giữa các lần thử.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Thông tin node đầu tiên được tìm thấy.
   *
   * @example
   * await findNode("TEXT", "Log in", 0, {"count":10,"after_ms":100});
   */
   findNode(type, keyword, position, retry, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "find_node", {type: type, keyword: keyword, position: position, retry: retry}, timeout);
   }


   /**
   * FIND NODES (Tìm tất cả các phần tử giao diện trên màn hình phù hợp với điều kiện chỉ định.)
   *
   * @param {string} type - Loại thuộc tính cần tìm: "XPATH", "TEXT", "DESCRIPTION", "RESOURCE_ID", "CLASS_NAME", "TEXT_OR_DESCRIPTION".
   * @param {string} keyword - Từ khóa tìm kiếm.
   * @param {object} retry - Cấu hình thử lại khi chưa tìm thấy node.
   * @param {number} retry.count - Số lần thử lại tối đa nếu chưa tìm thấy node.
   * @param {number} retry.after_ms - Thời gian chờ (ms) giữa các lần thử.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {array} - Thông tin danh sách node được tìm thấy.
   *
   * @example
   * await findNodes("TEXT", "Log in", {"count":10,"after_ms":100});
   */
   findNodes(type, keyword, retry, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "find_nodes", {type: type, keyword: keyword, retry: retry}, timeout);
   }


   /**
   * FIND NODE EXIST (Kiểm tra xem một node (thành phần giao diện) có tồn tại trên màn hình không.)
   *
   * @param {string} type - Loại thuộc tính cần tìm: "XPATH", "TEXT", "DESCRIPTION", "RESOURCE_ID", "CLASS_NAME", "TEXT_OR_DESCRIPTION".
   * @param {string} keyword - Từ khóa tìm kiếm.
   * @param {object} retry - Cấu hình thử lại khi chưa tìm thấy node.
   * @param {number} retry.count - Số lần thử lại tối đa nếu chưa tìm thấy node.
   * @param {number} retry.after_ms - Thời gian chờ (ms) giữa các lần thử.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái node được tìm thấy hay không.
   *
   * @example
   * await findNodeExist("TEXT", "Log in", {"count":10,"after_ms":100});
   */
   findNodeExist(type, keyword, retry, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "find_node_exist", {type: type, keyword: keyword, retry: retry}, timeout);
   }


   /**
   * FIND NODE AND CLICK (Tìm node (phần tử giao diện) theo tiêu chí và thực hiện nhấn (click) lên node đó.)
   *
   * @param {string} type - Loại thuộc tính cần tìm: "XPATH", "TEXT", "DESCRIPTION", "RESOURCE_ID", "CLASS_NAME", "TEXT_OR_DESCRIPTION".
   * @param {string} keyword - Từ khóa tìm kiếm.
   * @param {number} position - Vị trí node trong danh sách kết quả tìm được (bắt đầu từ 0). Dùng khi có nhiều node trùng điều kiện.
   * @param {object} retry - Cấu hình thử lại khi chưa tìm thấy node.
   * @param {number} retry.count - Số lần thử lại tối đa nếu chưa tìm thấy node.
   * @param {number} retry.after_ms - Thời gian chờ (ms) giữa các lần thử.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Thông tin node đầu tiên được tìm thấy.
   *
   * @example
   * await findNodeAndClick("TEXT", "Log in", 0, {"count":10,"after_ms":100});
   */
   findNodeAndClick(type, keyword, position, retry, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "find_node_and_click", {type: type, keyword: keyword, position: position, retry: retry}, timeout);
   }


   /**
   * FIND NODE AND SCROLL (Tìm node (phần tử giao diện) theo tiêu chí và thực hiện vuốt (swipe) lên node đó.)
   *
   * @param {string} type - Loại thuộc tính cần tìm: "XPATH", "TEXT", "DESCRIPTION", "RESOURCE_ID", "CLASS_NAME", "TEXT_OR_DESCRIPTION".
   * @param {string} keyword - Từ khóa tìm kiếm.
   * @param {number} position - Vị trí node trong danh sách kết quả tìm được (bắt đầu từ 0). Dùng khi có nhiều node trùng điều kiện.
   * @param {string} scroll_type - Hướng mà bạn muốn vuốt. Các thuộc tính vuốt gồm: "SCROLL_LEFT", "SCROLL_RIGHT", "SCROLL_TOP", "SCROLL_BOTTOM"
   * @param {number} swipe_time - Thời gian mà vuốt muốn vuốt, số càng nhỏ thì tốc độ vuốt càng nhanh.
   * @param {object} retry - Cấu hình thử lại khi chưa tìm thấy node.
   * @param {number} retry.count - Số lần thử lại tối đa nếu chưa tìm thấy node.
   * @param {number} retry.after_ms - Thời gian chờ (ms) giữa các lần thử.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Thông tin node đầu tiên được tìm thấy.
   *
   * @example
   * await findNodeAndScroll("TEXT", "Log in", 0, "SCROLL_LEFT", 500, {"count":10,"after_ms":100});
   */
   findNodeAndScroll(type, keyword, position, scrollType, swipeTime, retry, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "find_node_and_scroll", {type: type, keyword: keyword, position: position, scroll_type: scrollType, swipe_time: swipeTime, retry: retry}, timeout);
   }


   /**
   * FIND COLOR AND CLICK (Tìm vị trí màu sắc cụ thể trên màn hình và thực hiện click vào vị trí đó.)
   *
   * @param {string} color - Mã màu dưới dạng hex mà bạn muốn tìm kiếm.
   * @param {object} retry - Cấu hình thử lại khi chưa tìm thấy node.
   * @param {number} retry.count - Số lần thử lại tối đa nếu chưa tìm thấy node.
   * @param {number} retry.after_ms - Thời gian chờ (ms) giữa các lần thử.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái tìm thấy mã màu và bấm vào thành công hay không.
   *
   * @example
   * await findColorAndClick("#ffffff", {"count":10,"after_ms":100});
   */
   findColorAndClick(color, retry, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "find_color_and_click", {color: color, retry: retry}, timeout);
   }


   /**
   * FIND COLOR EXIST (Kiểm tra màu sắc cụ thể có xuất hiện trên màn hình hay không.)
   *
   * @param {string} color - Mã màu dưới dạng hex mà bạn muốn tìm kiếm.
   * @param {object} retry - Cấu hình thử lại khi chưa tìm thấy node.
   * @param {number} retry.count - Số lần thử lại tối đa nếu chưa tìm thấy node.
   * @param {number} retry.after_ms - Thời gian chờ (ms) giữa các lần thử.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái tìm thấy mã màu trên màn hình hay không.
   *
   * @example
   * await findColorExist("#ffffff", {"count":10,"after_ms":100});
   */
   findColorExist(color, retry, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "find_color_exist", {color: color, retry: retry}, timeout);
   }


   /**
   * FIND COLOR (Tìm vị trí xuất hiện đầu tiên của một màu cụ thể trên màn hình.)
   *
   * @param {string} color - Mã màu dưới dạng hex mà bạn muốn tìm kiếm.
   * @param {object} retry - Cấu hình thử lại khi chưa tìm thấy node.
   * @param {number} retry.count - Số lần thử lại tối đa nếu chưa tìm thấy node.
   * @param {number} retry.after_ms - Thời gian chờ (ms) giữa các lần thử.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Vị trí của mã màu được tìm thấy trên màn hình.
   *
   * @example
   * await findColor("#ffffff", {"count":10,"after_ms":100});
   */
   findColor(color, retry, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "find_color", {color: color, retry: retry}, timeout);
   }


   /**
   * FIND IMAGE (Tìm vị trí xuất hiện đầu tiên của một hình ảnh (so sánh theo base64) trên màn hình.)
   *
   * @param {string} base64_image - Ảnh mẫu cần tìm, được mã hóa dạng chuỗi base64 (thường là PNG/JPEG).
   * @param {object} retry - Cấu hình thử lại khi chưa tìm thấy node.
   * @param {number} retry.count - Số lần thử lại tối đa nếu chưa tìm thấy node.
   * @param {number} retry.after_ms - Thời gian chờ (ms) giữa các lần thử.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Vị trí của hình ảnh được tìm thấy trên màn hình.
   *
   * @example
   * await findImage("/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEB...", {"count":10,"after_ms":100});
   */
   findImage(base64Image, retry, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "find_image", {base64_image: base64Image, retry: retry}, timeout);
   }


   /**
   * CURRENT PROXY (Lấy thông tin cấu hình proxy hiện tại đang sử dụng trên thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Thông tin proxy đang được kết nối hiện tại.
   *
   * @example
   * await currentProxy();
   */
   currentProxy(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "current_proxy", {}, timeout);
   }


   /**
   * CONNECT PROXY (Kết nối tới một proxy mới với thông tin cấu hình chỉ định.)
   *
   * @param {string} type - Loại proxy sử dụng, ví dụ: "http", "socks4", "socks5".
   * @param {string} host - Địa chỉ IP hoặc hostname của proxy server.
   * @param {number} port - Cổng của proxy server (thường là 3128 cho HTTP, 1080 cho SOCKS).
   * @param {string} username - Tên đăng nhập proxy (nếu proxy yêu cầu xác thực), để trống nếu không cần.
   * @param {string} password - Mật khẩu proxy (nếu proxy yêu cầu xác thực), để trống nếu không cần.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái kết nối proxy thành công hay thất bại.
   *
   * @example
   * await connectProxy("socks5", "192.168.1.123", 8080, "user", "pass");
   */
   connectProxy(type, host, port, username, password, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "connect_proxy", {type: type, host: host, port: port, username: username, password: password}, timeout);
   }


   /**
   * CHECK PROXY CONNECTED (Kiểm tra thiết bị có đang kết nối proxy không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái proxy có đang kết nối hay không.
   *
   * @example
   * await checkProxyConnected();
   */
   checkProxyConnected(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_proxy_connected", {}, timeout);
   }


   /**
   * CHECK PROXY HAS INTERNET (Kiểm tra kết nối proxy hiện tại có truy cập được Internet không.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái proxy có kết nối mạng hay không.
   *
   * @example
   * await checkProxyHasInternet();
   */
   checkProxyHasInternet(timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_proxy_has_internet", {}, timeout);
   }


   /**
   * GET PROXY IP INFO (Lấy thông tin chi tiết về IP proxy hiện tại.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Thông tin chi tiết địa chỉ IP mà proxy đang kết nối thành công.
   *
   * @example
   * await getProxyIpInfo();
   */
   getProxyIpInfo(timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "get_proxy_ip_info", {}, timeout);
   }


   /**
   * EXECUTE COMMAND (Thực thi một lệnh hệ thống (shell command) với quyền tùy chọn.)
   *
   * @param {string} command - Lệnh hệ thống muốn thực thi.
   * @param {string} permission - Cấp quyền thực thi lệnh ("DEFAULT" - quyền thường, "ADB" - quyền adb, "ROOT" - quyền root).
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {string} - Kết quả của lệnh thực thi được hệ thống trả về.
   *
   * @example
   * await executeCommand("ls /sdcard", "DEFAULT");
   */
   executeCommand(command, permission, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "execute_command", {command: command, permission: permission}, timeout);
   }


   /**
   * VIBRATE (Rung thiết bị trong khoảng thời gian chỉ định (miligiây).)
   *
   * @param {number} time - Thời gian rung thiết bị (miligiây)
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái rung thiết bị thành công hay thất bại.
   *
   * @example
   * await vibrate(1000);
   */
   vibrate(time, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "vibrate", {time: time}, timeout);
   }


   /**
   * CHANGE VOLUME (Thay đổi mức âm lượng của thiết bị.)
   *
   * @param {number} volume - Giá trị mức âm lượng muốn đặt, là số nguyên trong khoảng cho phép của thiết bị (thường từ 0 đến 15 hoặc 0 đến 100 tuỳ thiết bị/kiểu stream).
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái thay đổi mức âm lượng thành công hay thất bại.
   *
   * @example
   * await changeVolume(100);
   */
   changeVolume(volume, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "change_volume", {volume: volume}, timeout);
   }


   /**
   * CREATE FOLDER (Tạo mới một thư mục trên thiết bị tại đường dẫn chỉ định.)
   *
   * @param {string} folder_path - Đường dẫn tuyệt đối hoặc tương đối của thư mục muốn tạo.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái tạo thư mục thành công hay thất bại.
   *
   * @example
   * await createFolder("/sdcard/newfolder");
   */
   createFolder(folderPath, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "create_folder", {folder_path: folderPath}, timeout);
   }


   /**
   * DELETE FILE (Xóa một tệp tin tại đường dẫn chỉ định trên thiết bị.)
   *
   * @param {string} file_path - Đường dẫn tuyệt đối hoặc tương đối của tệp muốn xóa.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái xóa tệp thành công hay thất bại.
   *
   * @example
   * await deleteFile("/sdcard/file.txt");
   */
   deleteFile(filePath, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "delete_file", {file_path: filePath}, timeout);
   }


   /**
   * DELETE FOLDER (Xóa một thư mục tại đường dẫn chỉ định trên thiết bị.)
   *
   * @param {string} folder_path - Đường dẫn tuyệt đối hoặc tương đối của thư mục muốn xóa.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái xóa thư mục thành công hay thất bại.
   *
   * @example
   * await deleteFolder("/sdcard/newfolder");
   */
   deleteFolder(folderPath, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "delete_folder", {folder_path: folderPath}, timeout);
   }


   /**
   * READ FILE (Đọc nội dung từ file tại đường dẫn chỉ định.)
   *
   * @param {string} file_path - Đường dẫn tuyệt đối hoặc tương đối của tệp muốn đọc.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {string} - Nội dung của tệp mà thiết bị đọc được.
   *
   * @example
   * await readFile("/sdcard/file.txt");
   */
   readFile(filePath, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "read_file", {file_path: filePath}, timeout);
   }


   /**
   * WRITE FILE (Ghi nội dung vào file tại đường dẫn chỉ định, với chế độ ghi đè hoặc ghi tiếp.)
   *
   * @param {string} file_path - Đường dẫn tuyệt đối hoặc tương đối của tệp muốn ghi vào.
   * @param {string} content - Nội dung muốn ghi vào file, là chuỗi bất kỳ (có thể là text, json, base64, ... tuỳ trường hợp).
   * @param {string} mode - Chế độ ghi file ("Overwrite" - Ghi đè nội dung cũ (tạo mới nếu chưa có), "Append" - Ghi nối thêm vào cuối file).
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái ghi nội dung vào tệp thành công hay thất bại.
   *
   * @example
   * await writeFile("/sdcard/file.txt", "Hello World", "Overwrite");
   */
   writeFile(filePath, content, mode, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "write_file", {file_path: filePath, content: content, mode: mode}, timeout);
   }


   /**
   * CHECK IS FILE (Kiểm tra đường dẫn chỉ định có phải là tệp tin không.)
   *
   * @param {string} file_path - Đường dẫn tuyệt đối hoặc tương đối của tệp muốn kiểm tra.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái đường dẫn chỉ định có phải là tệp tin không.
   *
   * @example
   * await checkIsFile("/sdcard/file.txt");
   */
   checkIsFile(filePath, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_is_file", {file_path: filePath}, timeout);
   }


   /**
   * CHECK IS FOLDER (Kiểm tra đường dẫn chỉ định có phải là thư mục không.)
   *
   * @param {string} folder_path - Đường dẫn tuyệt đối hoặc tương đối của thư mục muốn kiểm tra.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái đường dẫn chỉ định có phải là thư mục không.
   *
   * @example
   * await checkIsFolder("/sdcard/folder");
   */
   checkIsFolder(folderPath, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_is_folder", {folder_path: folderPath}, timeout);
   }


   /**
   * CHECK FOLDER EXIST (Kiểm tra thư mục với đường dẫn chỉ định có tồn tại không.)
   *
   * @param {string} folder_path - Đường dẫn tuyệt đối hoặc tương đối của thư mục muốn kiểm tra.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái thư mục có tồn tại hay không.
   *
   * @example
   * await checkFolderExist("/sdcard/folder");
   */
   checkFolderExist(folderPath, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_folder_exist", {folder_path: folderPath}, timeout);
   }


   /**
   * CHECK FILE EXIST (Kiểm tra tệp tin tại đường dẫn chỉ định có tồn tại không.)
   *
   * @param {string} file_path - Đường dẫn tuyệt đối hoặc tương đối của tệp muốn kiểm tra.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái tệp có tồn tại hay không.
   *
   * @example
   * await checkFileExist("/sdcard/file.txt");
   */
   checkFileExist(filePath, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "check_file_exist", {file_path: filePath}, timeout);
   }


   /**
   * LIST CHILD FILES (Liệt kê danh sách file/thư mục con trong một thư mục chỉ định.)
   *
   * @param {string} folder_path - Đường dẫn tuyệt đối hoặc tương đối của thư mục muốn liệt kê thư mục và tệp con.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {array} - Danh sách thư mục và tệp con nếu có.
   *
   * @example
   * await listChildFiles("/sdcard/folder");
   */
   listChildFiles(folderPath, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "list_child_files", {folder_path: folderPath}, timeout);
   }


   /**
   * DELETE ALL IMAGE GALLERY (Xóa toàn bộ ảnh trong thư viện ảnh (Gallery) của thiết bị.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái xóa tất cả hình ảnh trong bộ sưu tập thành công hay thất bại.
   *
   * @example
   * await deleteAllImageGallery();
   */
   deleteAllImageGallery(timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "delete_all_image_gallery", {}, timeout);
   }


   /**
   * INSERT IMAGE GALLERY (Chèn một ảnh từ đường dẫn file vào thư viện ảnh (gallery) của thiết bị.)
   *
   * @param {string} file_path - Đường dẫn tuyệt đối hoặc tương đối của tệp hình ảnh muốn thêm vào bộ sưu tập.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái thêm hình ảnh vào bộ sưu tập thành công hay thất bại.
   *
   * @example
   * await insertImageGallery("/sdcard/image.jpg");
   */
   insertImageGallery(filePath, timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "insert_image_gallery", {file_path: filePath}, timeout);
   }


   /**
   * REBOOT DEVICE (Khởi động lại thiết bị Android từ xa.)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái khởi động lại thiết bị thành công hay thất bại.
   *
   * @example
   * await rebootDevice();
   */
   rebootDevice(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "reboot_device", {}, timeout);
   }


   /**
   * GET DEVICE INFO (Lấy thông tin chi tiết về thiết bị (model, hãng sản xuất, phiên bản hệ điều hành...).)
   *
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Thông tin chi tiết về thiết bị (model, hãng sản xuất, phiên bản hệ điều hành...)
   *
   * @example
   * await getDeviceInfo();
   */
   getDeviceInfo(timeout = 5000) {
      return this.ws.sendActionToDevice(this.deviceId, "get_device_info", {}, timeout);
   }


   /**
   * INSTALL CHANGE INFO APP (Cài đặt ứng dụng đã được chỉnh sửa để có thể: Change Info, Backup, Restore,...)
   *
   * @param {string} api_key - Api key của ứng dụng đã được chỉnh sửa, được lấy từ "https://phonecloud.one/applications".
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Thông tin chi tiết của ứng dụng đã được chỉnh sửa.
   *
   * @example
   * await installChangeInfoApp("2dae96c2-90ac-4680-aea2-fb3c51721d03");
   */
   installChangeInfoApp(apiKey, timeout = 180000) {
      return this.ws.sendActionToDevice(this.deviceId, "install_change_info_app", {api_key: apiKey}, timeout);
   }


   /**
   * CHANGE APP INFO (Thay đổi thông tin thiết bị mà ứng dụng đọc được (chỉ hỗ trợ nếu ứng dụng đã được chỉnh sửa).)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn muốn thay đổi thông tin.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái đã thay đổi thông tin ứng dụng thành công hay thất bại
   *
   * @example
   * await changeAppInfo("com.facebook.katana");
   */
   changeAppInfo(packageName, timeout = 10000) {
      return this.ws.sendActionToDevice(this.deviceId, "change_app_info", {package_name: packageName}, timeout);
   }


   /**
   * BACKUP APP DATA (Sao lưu dữ liệu của ứng dụng (chỉ hỗ trợ nếu ứng dụng đã được chỉnh sửa).)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn muốn sao lưu dữ liệu.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Thông tin chi tiết tài khoản của ứng dụng.
   *
   * @example
   * await backupAppData("com.facebook.katana");
   */
   backupAppData(packageName, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "backup_app_data", {package_name: packageName}, timeout);
   }


   /**
   * RESTORE APP DATA (Khôi phục dữ liệu của ứng dụng (chỉ hỗ trợ nếu ứng dụng đã được chỉnh sửa).)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn muốn khôi phục dữ liệu.
   * @param {string} backup_path - Đường dẫn đến tệp nén (.7z) dữ liệu ứng dụng mà bạn đã sao lưu trước đó.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {boolean} - Trạng thái khôi phục dữ liệu ứng dụng thành công hay thất bại
   *
   * @example
   * await restoreAppData("com.facebook.katana", "/sdcard/backup.7z");
   */
   restoreAppData(packageName, backupPath, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "restore_app_data", {package_name: packageName, backup_path: backupPath}, timeout);
   }


   /**
   * READ APP DATA (Đọc dữ liệu của ứng dụng (chỉ hỗ trợ nếu ứng dụng đã được chỉnh sửa).)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn muốn đọc dữ liệu.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Thông tin chi tiết tài khoản của ứng dụng.
   *
   * @example
   * await readAppData("com.facebook.katana");
   */
   readAppData(packageName, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "read_app_data", {package_name: packageName}, timeout);
   }


   /**
   * BACKUP AND UPLOAD ACCOUNT (Sao lưu và tải lên tài khoản của 1 ứng dụng bằng tên gói ứng dụng (chỉ hỗ trợ nếu ứng dụng đã được chỉnh sửa).)
   *
   * @param {string} package_name - Tên package của ứng dụng mà bạn muốn sao lưu dữ liệu.
   * @param {number} timeout - Thời gian chờ tối đa (ms) cho thao tác.
   *
   * @returns {object} - Thông tin chi tiết tài khoản của ứng dụng.
   *
   * @example
   * await backupAndUploadAccount("com.facebook.katana");
   */
   backupAndUploadAccount(packageName, timeout = 15000) {
      return this.ws.sendActionToDevice(this.deviceId, "backup_and_upload_account", {package_name: packageName}, timeout);
   }


}