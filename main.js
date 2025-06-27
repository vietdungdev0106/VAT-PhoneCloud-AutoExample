let api = null;
let devices = [];

let ws = null;
let wsReconnectTimer = null;
let wsPendingActions = {};

let contextMenuIdx = null;
let contextMenu = document.getElementById('contextMenu');

let currentPage = 1;
let pageSize = 100; // Số lượng thiết bị mỗi trang (có thể chỉnh tùy ý)
let totalPages = 0;

function connect() {
    const apiKey = getApiKey();
    if (apiKey.length === 0) {
        alert("Vui lòng Api Key. Chi tiết vui lòng đọc hướng dẫn sử dụng ở Repo!");
        return;
    }
    const appModApiKey = getAppModApiKey();
    if (appModApiKey.length === 0) {
        alert("Vui lòng thêm Api Key của ứng dụng. Chi tiết vui lòng đọc hướng dẫn sử dụng ở Repo!");
        return;
    }
    api = new PhoneCloudApi(apiKey);
    refreshDevices();
}

function refreshDevices(page = 1) {
    api.listDevicePartyUser({ page: currentPage, limit: pageSize })
        .then(data => {
            if (data.code != 200) {
                throw new Error("Api Device List Error " + data.code);
            }
            totalPages = Math.ceil(data.data.total / pageSize);
            devices = (data.data.devices || []);
            devices.forEach(d => {
                d.selected = false
                d.action = "Idle"
            });
            renderTable();

            if (devices.length > 0) {
                connectWebSocket();
            }
        })
        .catch(err => console.error(err));
}

function connectWebSocket() {
    if (!devices) {
        return;
    }
    const apiKey = getApiKey();

    ws = new PhoneCloudWs({
        apiKey,
        devices,
        debug: false,
    });
    ws.onOpen = () => {
        devices.forEach(d => d.subId = "");
    };
    ws.onDeviceConnected = (subscribe) => {
        const device = devices.find(d => d.id === subscribe.device_id);
        if (device) {
            device.status = "CONNECTED";
            renderTable();
        }
    };
    ws.onDeviceDisconnected = (subscribe) => {
        const device = devices.find(d => d.id === subscribe.device_id);
        if (device) {
            device.status = "DISCONNECTED";
            renderTable();
        }
    };
    ws.onClose = () => {
        devices.forEach(d => d.subId = "");
    };
}

function getApiKey() {
    return document.getElementById('apiKeyInput').value.trim();
}

function getAppModApiKey() {
    return document.getElementById('appModApiKeyInput').value.trim();
}

function renderTable() {
    const tbodyOld = document.querySelector('#deviceTable tbody');
    const tbodyNew = document.createElement('tbody');

    devices.forEach((dev, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <input type="checkbox" ${dev.selected ? "checked" : ""} onchange="toggleSelectDevice(${idx}, this)" />
            </td>
            <td>${idx + 1}</td>
            <td>${dev.id}</td>
            <td>${dev.device_name}</td>
            <td>${dev.status === "ACTIVED" ? (dev.device_status === "CONNECTED" ? "CONNECTING" : dev.device_status) : dev.status || "Unknown"}</td>
            <td>${dev.config_device.proxy.api_key}</td>
            <td>${dev.action}</td>
        `;
        tr.oncontextmenu = (event) => showContextMenu(event, idx);
        tbodyNew.appendChild(tr);
    });
    tbodyOld.parentNode.replaceChild(tbodyNew, tbodyOld);

    renderPagination();
}

function renderPagination() {
    let pagination = document.getElementById('pagination');
    if (!pagination) {
        pagination = document.createElement('div');
        pagination.id = 'pagination';
        pagination.style.textAlign = 'center';
        pagination.style.margin = '20px 0 0 0';
        document.querySelector('.table-container').appendChild(pagination);
    }
    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }
    let html = `
        <button onclick="gotoPage(1)" ${currentPage === 1 ? 'disabled' : ''}>⏮</button>
        <button onclick="gotoPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>⬅</button>
        <span style="margin:0 10px">Page <b>${currentPage}</b> / ${totalPages}</span>
        <button onclick="gotoPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>➡</button>
        <button onclick="gotoPage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>⏭</button>
    `;
    pagination.innerHTML = html;
}

function gotoPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    refreshDevices(page);
}

// Xử lý Context Menu
function showContextMenu(event, idx) {
    event.preventDefault();
    hideContextMenu();
    contextMenuIdx = idx;
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    contextMenu.style.display = 'block';
    setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
    }, 0);
}
function hideContextMenu() {
    contextMenu.style.display = 'none';
    document.removeEventListener('mousedown', handleClickOutside);
    contextMenuIdx = null;
}
function handleClickOutside(event) {
    if (!contextMenu.contains(event.target)) {
        hideContextMenu();
    }
}
window.addEventListener('scroll', hideContextMenu);
window.addEventListener('resize', hideContextMenu);

// Xử lý CheckBox
function toggleSelectDevice(idx, checkbox) {
    devices[idx].selected = checkbox.checked;
}
function toggleSelectAll(masterCheckbox) {
    const checked = masterCheckbox.checked;
    devices.forEach(d => d.selected = checked);
    renderTable();
}
function getSelectedDevices() {
    return devices.filter(d => d.selected);
}

function notifyDeviceAction(deviceId, action) {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
        device.action = action;
    }
    renderTable();
}

async function contextFacebookRegister() {
    if (contextMenuIdx !== null) {
        hideContextMenu();

        const selectedDevices = getSelectedDevices();
        if (selectedDevices.length > 0) {
            await Promise.all(selectedDevices.map(device => {
                startRegisterFacebook(device);
            }));
        } else {
            startRegisterFacebook(devices[contextMenuIdx]);
        }
    }
}

const genderMaps = ["Female", "Male"];
const dayMaps = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"];
const monthMaps = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function startRegisterFacebook(device) {
    if (!device) {
        return;
    }
    let retryCount = 0;
    const maxRetry = 5; // số lần retry tối đa khi lỗi
    const delayAfterError = 5000; // đợi 5 giây sau khi có lỗi trước khi retry

    while (retryCount < maxRetry) {
        try {
            await loopRegisterFacebook(device);
            retryCount = 0; // reset retry khi thành công
        } catch (e) {
            console.error(`Lỗi khi thực hiện đăng ký cho device ${device.id}:`, e);
            retryCount++;
            if (retryCount >= maxRetry) {
                console.error(`Dừng task đăng ký Facebook cho device ${device.id} sau ${maxRetry} lần lỗi liên tiếp.`);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, delayAfterError));
        }
    }
}

async function loopRegisterFacebook(device) {
    const deviceId = device.id;
    try {
        const action = new PhoneCloudActions(ws, deviceId);
        const phoneNumber = "0843" + action.randomNumber(100000, 999999);
        const password = action.randomString(10, 15, { hasNumber: true, hasUpperCase: true, hasSpecialChar: false });
        const day = action.randomNumber(1, 28);
        const dayStr = dayMaps[day - 1];
        const month = action.randomNumber(1, 12);
        const monthStr = monthMaps[month - 1];
        const year = action.randomNumber(1985, 2005);
        const gender = genderMaps[action.randomNumber(0, 1)];
        const name = gender === "Male" ? nameMale[action.randomNumber(0, nameMale.length - 1)] : nameFemale[action.randomNumber(0, nameFemale.length - 1)];

        notifyDeviceAction(deviceId, "Bắt đầu cài đặt App Facebook.");
        const installChangeInfoResult = await action.installChangeInfoApp(getAppModApiKey(), 5 * 60 * 1000);
        if (installChangeInfoResult.status) {
            if (installChangeInfoResult.result) {
                notifyDeviceAction(deviceId, "Thay đổi thông tin ứng dụng thành công.");
            } else {
                notifyDeviceAction(deviceId, "Thay đổi thông tin ứng dụng thất bại.");
                return;
            }
        } else {
            throw new Error(installChangeInfoResult.error);
        }
        const packageName = installChangeInfoResult.result.package_name;

        const clearAppDataResult = await action.clearAppData(packageName);
        if (clearAppDataResult.status) {
            if (!clearAppDataResult.result) {
                notifyDeviceAction(deviceId, "Xóa dữ liệu ứng dụng thất bại.");
                return;
            }
        } else {
            throw new Error(clearAppDataResult.error);
        }

        let proxy;
        for (let i = 0; i < 120; i++) {
            try {
                const res = await api.getNewIpRotateProxyParty(device);
                if (res) {
                    proxy = res.data;
                    notifyDeviceAction(deviceId, "Lấy IP mới thành công.");
                    break;
                }
            } catch (e) {
                notifyDeviceAction(deviceId, "Lấy proxy thất bại: " + (i + 1) + "/120");
            }
            await action.sleep(1000);
        }

        const connectProxyResult = await action.connectProxy(proxy.tcp_type, proxy.ip_proxy, proxy.port, proxy.username, proxy.password);
        if (connectProxyResult.status) {
            if (!connectProxyResult.result) {
                notifyDeviceAction(deviceId, "Kết nối proxy thất bại.");
                return;
            }
        } else {
            throw new Error(connectProxyResult.error);
        }

        let hasInternet = false;
        notifyDeviceAction(deviceId, "Đang kiểm tra kết nối Internet của proxy.");
        for (let i = 0; i < 20; i++) {
            const checkProxyResult = await action.checkProxyHasInternet();
            console.log("checkProxyResult: ", checkProxyResult);
            if (checkProxyResult.status && checkProxyResult.result) {
                hasInternet = true;
                break;
            }
            await action.sleep(3000);
        }
        if (!hasInternet) {
            notifyDeviceAction(deviceId, "Không có kết nối internet từ proxy.");
            return;
        }

        const changeAppInfoResult = await action.changeAppInfo(packageName);
        if (changeAppInfoResult.status) {
            if (changeAppInfoResult.result) {
                notifyDeviceAction(deviceId, "Thay đổi thông tin ứng dụng thành công.");
            } else {
                notifyDeviceAction(deviceId, "Thay đổi thông tin ứng dụng thất bại.");
                return;
            }
        } else {
            throw new Error(changeAppInfoResult.error);
        }

        notifyDeviceAction(deviceId, "Đang mở Facebook App.");

        const openFacebook = await action.openApp(packageName);
        if (openFacebook.status) {
            if (openFacebook.result) {
                notifyDeviceAction(deviceId, "Mở Facebook App thành công.");
            } else {
                notifyDeviceAction(deviceId, "Mở Facebook App thất bại.");
                return;
            }
        } else {
            throw new Error(openFacebook.error);
        }

        notifyDeviceAction(deviceId, "Đợi 'Terms and Privacy Policy' xuất hiện.");

        let findAndWaitTermsAndPrivacyPolicy = await action.findNodeExist("XPATH", "//*[@text='Terms and Privacy Policy']", { count: 150, after_ms: 200 }, 30000);
        if (findAndWaitTermsAndPrivacyPolicy.status) {
            if (!findAndWaitTermsAndPrivacyPolicy.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Terms and Privacy Policy'.");
                return;
            }
        } else {
            throw new Error(findAndWaitTermsAndPrivacyPolicy.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Continue'.");
        await action.sleep(1000);

        let findAndClickContinueBtn = await action.findNodeAndClick("XPATH", "//*[@text='Continue']", 0, { count: 150, after_ms: 100 }, 30000);
        if (findAndClickContinueBtn.status) {
            if (!findAndClickContinueBtn.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Continue'.");
                return;
            }
        } else {
            throw new Error(findAndClickContinueBtn.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Create new account'.");
        await action.sleep(1000);

        let findAndClickCreateNewAccountBtn = await action.findNodeAndClick("XPATH", "//*[@text='Create new account']", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickCreateNewAccountBtn.status) {
            if (!findAndClickCreateNewAccountBtn.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Create new account'.");
                return;
            }
        } else {
            throw new Error(findAndClickCreateNewAccountBtn.error);
        }

        notifyDeviceAction(deviceId, "Đợi màn hình 'Join Facebook' xuất hiện.");
        await action.sleep(1000);

        let findAndWaitJoinFacebook = await action.findNodeExist("XPATH", "//*[@text='Join Facebook']", { count: 150, after_ms: 100 }, 20000);
        if (findAndWaitJoinFacebook.status) {
            if (!findAndWaitJoinFacebook.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Join Facebook'.");
                return;
            }
        } else {
            throw new Error(findAndWaitTermsAndPrivacyPolicy.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Create new account'.");
        await action.sleep(1000);

        findAndClickCreateNewAccountBtn = await action.findNodeAndClick("XPATH", "//*[@text='Create new account']", 0);
        if (!findAndClickCreateNewAccountBtn.status || findAndClickCreateNewAccountBtn.result) {
            findAndClickCreateNewAccountBtn = await action.findNodeAndClick("XPATH", "//*[@text='Get started']", 0);
            if (!findAndClickCreateNewAccountBtn.status || findAndClickCreateNewAccountBtn.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Create new account' hoặc 'Get started'.");
                return;
            }
        }

        notifyDeviceAction(deviceId, "Đợi 2 giây rồi kiểm tra có xuất hiển popup Cấp quyền không.");
        await action.sleep(2000);

        const currentTopActivity = await action.getTopActivityInfo();
        if (!currentTopActivity.status) {
            throw new Error(currentTopActivity.error);
        }
        if (currentTopActivity.result.activity.includes('permission')) {
            notifyDeviceAction(deviceId, "Xuất hiển popup Cấp quyền, đợi 1 giây rồi nhấn 'Allow'.");
            await action.sleep(1000);

            let findAndClickAllow = await action.findNodeAndClick("XPATH", "//*[@resource-id='com.android.permissioncontroller:id/permission_allow_button']", 0, { count: 150, after_ms: 100 }, 20000);
            if (findAndClickAllow.status) {
                if (!findAndClickAllow.result) {
                    notifyDeviceAction(deviceId, "Không tìm thấy 'Allow'.");
                    return;
                }
            } else {
                throw new Error(findAndClickAllow.error);
            }
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'First name'.");
        await action.sleep(1000);

        let findAndClickFirstName = await action.findNodeAndClick("XPATH", "(//*[@text='First name'])[2]", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickFirstName.status) {
            if (!findAndClickFirstName.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'First name'.");
                return;
            }
        } else {
            throw new Error(findAndClickFirstName.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi điền '" + name.first_name + "'.");
        await action.sleep(1000);

        const inputFirstName = await action.keyboardInputText(name.first_name);
        if (inputFirstName.status) {
            if (!inputFirstName.result) {
                notifyDeviceAction(deviceId, "Điền \"First name\" thất bại.");
                return;
            }
        } else {
            throw new Error(inputFirstName.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Last name'.");
        await action.sleep(1000);

        let findAndClickLastName = await action.findNodeAndClick("XPATH", "(//*[@text='Last name'])[2]", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickLastName.status) {
            if (!findAndClickLastName.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Last name'.");
                return;
            }
        } else {
            throw new Error(findAndClickLastName.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi điền '" + name.mid_name + "'.");
        await action.sleep(1000);

        const inputLastName = await action.keyboardInputText(name.mid_name);
        if (inputLastName.status) {
            if (!inputLastName.result) {
                notifyDeviceAction(deviceId, "Điền \"Last name\" thất bại.");
                return;
            }
        } else {
            throw new Error(inputLastName.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Next'.");
        await action.sleep(1000);

        let findAndClickNext = await action.findNodeAndClick("XPATH", "//*[@text='Next']", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickNext.status) {
            if (!findAndClickNext.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Next'.");
                return;
            }
        } else {
            throw new Error(findAndClickNext.error);
        }

        notifyDeviceAction(deviceId, "Đợi popup 'Set Date' xuất hiện.");
        let findAndWaitSetDate = await action.findNodeExist("XPATH", "//*[@text='Set date']", { count: 150, after_ms: 100 }, 30000);
        if (findAndWaitSetDate.status) {
            if (!findAndWaitSetDate.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Set date'.");
                return;
            }
        } else {
            throw new Error(findAndWaitSetDate.error);
        }

        notifyDeviceAction(deviceId, "Click vào 'Chọn tháng'.");
        let findAndClickMonthEdt = await action.findNodeAndClick("CLASS_NAME", "android.widget.EditText", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickMonthEdt.status) {
            if (!findAndClickMonthEdt.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Chọn tháng'.");
                return;
            }
        } else {
            throw new Error(findAndClickMonthEdt.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi tháng '" + monthStr + "'.");
        await action.sleep(1000);

        const inputMonth = await action.keyboardInputText(monthStr);
        if (inputMonth.status) {
            if (!inputMonth.result) {
                notifyDeviceAction(deviceId, "Điền \"Chọn tháng\" thất bại.");
                return;
            }
        } else {
            throw new Error(inputMonth.error);
        }

        notifyDeviceAction(deviceId, "Click vào 'Chọn ngày'.");
        let findAndClickDayEdt = await action.findNodeAndClick("CLASS_NAME", "android.widget.EditText", 1, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickDayEdt.status) {
            if (!findAndClickDayEdt.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Chọn ngày'.");
                return;
            }
        } else {
            throw new Error(findAndClickDayEdt.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi điền ngày '" + dayStr + "'.");
        await action.sleep(1000);

        const inputDay = await action.keyboardInputText(dayStr);
        if (inputDay.status) {
            if (!inputDay.result) {
                notifyDeviceAction(deviceId, "Điền \"Chọn ngày\" thất bại.");
                return;
            }
        } else {
            throw new Error(inputDay.error);
        }

        notifyDeviceAction(deviceId, "Click vào 'Chọn năm'.");
        let findAndClickYearEdt = await action.findNodeAndClick("CLASS_NAME", "android.widget.EditText", 2, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickYearEdt.status) {
            if (!findAndClickYearEdt.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Chọn ngày'.");
                return;
            }
        } else {
            throw new Error(findAndClickYearEdt.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi điền năm '" + year.toString() + "'.");
        await action.sleep(1000);

        const inputYear = await action.keyboardInputText(year.toString());
        if (inputYear.status) {
            if (!inputYear.result) {
                notifyDeviceAction(deviceId, "Điền \"Chọn năm\" thất bại.");
                return;
            }
        } else {
            throw new Error(inputYear.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'SET'.");
        await action.sleep(1000);

        let findAndClickSet = await action.findNodeAndClick("XPATH", "//*[@text='SET']", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickSet.status) {
            if (!findAndClickSet.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'SET'.");
                return;
            }
        } else {
            throw new Error(findAndClickSet.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Next'.");
        await action.sleep(1000);

        findAndClickNext = await action.findNodeAndClick("XPATH", "//*[@text='Next']", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickNext.status) {
            if (!findAndClickNext.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Next'.");
                return;
            }
        } else {
            throw new Error(findAndClickNext.error);
        }

        notifyDeviceAction(deviceId, "Đợi màn hình 'What's your gender?' xuất hiện.");
        let findAndWaitChooseGender = await action.findNodeExist("XPATH", "//*[@text='What&#39;s your gender?']", { count: 150, after_ms: 100 }, 20000);
        if (findAndWaitChooseGender.status) {
            if (!findAndWaitChooseGender.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'What's your gender?'.");
                return;
            }
        } else {
            throw new Error(findAndWaitChooseGender.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click '" + gender + "'.");
        await action.sleep(1000);

        let findAndClickMale = await action.findNodeAndClick("XPATH", "//*[@text='" + gender + "']", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickMale.status) {
            if (!findAndClickMale.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy '" + gender + "'.");
                return;
            }
        } else {
            throw new Error(findAndClickMale.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Next'.");
        await action.sleep(1000);

        findAndClickNext = await action.findNodeAndClick("XPATH", "//*[@text='Next']", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickNext.status) {
            if (!findAndClickNext.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Next'.");
                return;
            }
        } else {
            throw new Error(findAndClickNext.error);
        }

        notifyDeviceAction(deviceId, "Đợi màn hình 'What's your mobile number?' xuất hiện.");
        let findAndWaitChoosePhoneNumber = await action.findNodeExist("XPATH", "//*[@text='What&#39;s your mobile number?']", { count: 150, after_ms: 100 }, 20000);
        if (findAndWaitChoosePhoneNumber.status) {
            if (!findAndWaitChoosePhoneNumber.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'What's your mobile number?'.");
                return;
            }
        } else {
            throw new Error(findAndWaitChoosePhoneNumber.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Mobile number'.");
        await action.sleep(1000);

        let findAndClickMobileNumber = await action.findNodeAndClick("XPATH", "(//*[@text='Mobile number'])[2]", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickMobileNumber.status) {
            if (!findAndClickMobileNumber.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Mobile number'.");
                return;
            }
        } else {
            throw new Error(findAndClickMobileNumber.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi điền năm '" + phoneNumber + "'.");
        await action.sleep(1000);

        const inputPhoneNumber = await action.keyboardInputText(phoneNumber);
        if (inputPhoneNumber.status) {
            if (!inputPhoneNumber.result) {
                notifyDeviceAction(deviceId, "Điền \"Mobile number\" thất bại.");
                return;
            }
        } else {
            throw new Error(inputPhoneNumber.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Next'.");
        await action.sleep(1000);

        findAndClickNext = await action.findNodeAndClick("XPATH", "//*[@text='Next']", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickNext.status) {
            if (!findAndClickNext.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Next'.");
                return;
            }
        } else {
            throw new Error(findAndClickNext.error);
        }

        notifyDeviceAction(deviceId, "Đợi màn hình 'Create a password' xuất hiện.");
        let findAndWaitCreatePassword = await action.findNodeExist("XPATH", "//*[@text='Create a password']", { count: 150, after_ms: 100 }, 20000);
        if (findAndWaitCreatePassword.status) {
            if (!findAndWaitCreatePassword.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Create a password'.");
                return;
            }
        } else {
            throw new Error(findAndWaitCreatePassword.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Password'.");
        await action.sleep(1000);

        let findAndClickPassword = await action.findNodeAndClick("XPATH", "(//*[@text='Password'])[2]", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickPassword.status) {
            if (!findAndClickPassword.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Password'.");
                return;
            }
        } else {
            throw new Error(findAndClickPassword.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi điền mật khẩu '" + password + "'.");
        await action.sleep(1000);

        const inputPassword = await action.keyboardInputText(password);
        if (inputPassword.status) {
            if (!inputPassword.result) {
                notifyDeviceAction(deviceId, "Điền \"Password\" thất bại.");
                return;
            }
        } else {
            throw new Error(inputPassword.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Next'.");
        await action.sleep(1000);

        findAndClickNext = await action.findNodeAndClick("XPATH", "//*[@text='Next']", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickNext.status) {
            if (!findAndClickNext.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Next'.");
                return;
            }
        } else {
            throw new Error(findAndClickNext.error);
        }

        notifyDeviceAction(deviceId, "Đợi màn hình 'Save your login info?' xuất hiện.");
        let findAndWaitSaveLogin = await action.findNodeExist("XPATH", "//*[@text='Save your login info?']", { count: 150, after_ms: 100 }, 20000);
        if (findAndWaitSaveLogin.status) {
            if (!findAndWaitSaveLogin.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Save your login info?'.");
                return;
            }
        } else {
            throw new Error(findAndWaitSaveLogin.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'Not now'.");
        await action.sleep(1000);

        let findAndClickNotNow = await action.findNodeAndClick("XPATH", "//*[@text='Not now']", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickNotNow.status) {
            if (!findAndClickNotNow.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Not now'.");
                return;
            }
        } else {
            throw new Error(findAndClickNotNow.error);
        }

        notifyDeviceAction(deviceId, "Đợi màn hình 'Terms And Policies' xuất hiện.");
        let findAndWaitTermsAndPolicies = await action.findNodeExist("XPATH", "//*[@text='To sign up, read and agree to our terms and policies']", { count: 150, after_ms: 100 }, 20000);
        if (findAndWaitTermsAndPolicies.status) {
            if (!findAndWaitTermsAndPolicies.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'Terms And Policies'.");
                return;
            }
        } else {
            throw new Error(findAndWaitTermsAndPolicies.error);
        }

        notifyDeviceAction(deviceId, "Đợi 1 giây rồi click 'I agree'.");
        await action.sleep(1000);

        let findAndClickIAgree = await action.findNodeAndClick("XPATH", "//*[@text='I agree']", 0, { count: 150, after_ms: 100 }, 20000);
        if (findAndClickIAgree.status) {
            if (!findAndClickIAgree.result) {
                notifyDeviceAction(deviceId, "Không tìm thấy 'I agree'.");
                return;
            }
        } else {
            throw new Error(findAndClickIAgree.error);
        }
        notifyDeviceAction(deviceId, "Tài khoản đang được tạo.");
        await action.sleep(5000);

        // Bắt đầu kiểm tra các trường hợp: Checkpoint, Confirm SMS OTP Phone, Confirm OTP Email,...
        for (let i = 0; i < 60; i++) {
            await action.sleep(1000);

            let checkConfirmOtpPhone = await action.findNodeExist("XPATH", "//*[@text='Confirm your mobile number with an SMS']");
            if (checkConfirmOtpPhone.status && checkConfirmOtpPhone.result) {
                notifyDeviceAction(deviceId, "Tạo tài khoản thành công, đang sao lưu tài khoản.");
                const account = await action.backupAndUploadAccount(packageName);

                console.log("account: ", account);
                return;
            }
            checkConfirmOtpPhone = await action.findNodeExist("XPATH", "//*[@text='Confirm your mobile number']");
            if (checkConfirmOtpPhone.status && checkConfirmOtpPhone.result) {
                notifyDeviceAction(deviceId, "Tạo tài khoản thành công, đang sao lưu tài khoản.");
                const account = await action.backupAndUploadAccount(packageName);

                console.log("account: ", account);
                return;
            }
            checkConfirmOtpPhone = await action.findNodeExist("XPATH", "//*[@text='Confirm your Facebook account with a phone call?']");
            if (checkConfirmOtpPhone.status && checkConfirmOtpPhone.result) {
                notifyDeviceAction(deviceId, "Tạo tài khoản thành công, đang sao lưu tài khoản.");
                const account = await action.backupAndUploadAccount(packageName);

                console.log("account: ", account);
                return;
            }
            checkConfirmOtpPhone = await action.findNodeExist("XPATH", "//*[@text='Enter the confirmation code']");
            if (checkConfirmOtpPhone.status && checkConfirmOtpPhone.result) {
                notifyDeviceAction(deviceId, "Tạo tài khoản thành công, đang sao lưu tài khoản.");
                const account = await action.backupAndUploadAccount(packageName);

                console.log("account: ", account);
                return;
            }
            let checkPoint = await action.findNodeExist("XPATH", "//*[@text='You won&#39;t be able to use your account until you complete this.']");
            if (checkPoint.status && checkPoint.result) {
                notifyDeviceAction(deviceId, "Checkpoint.");
                return;
            }
        }
        notifyDeviceAction(deviceId, "Quá thời gian chờ. Dừng và chuẩn bị đăng ký tài khoản khác.");
    } catch (e) {
        notifyDeviceAction(deviceId, "Error: " + e.message);
        return;
    }
}