const state = {
  lang: 'ar',
  user: null,
  currentPayment: '',
  currentEmployee: '',
  draftEntries: [],
  employees: [],
  drivers: [],
  dashboard: null,
};

const i18n = {
  ar: {
    loginTitle: 'تسجيل الدخول', loginHelp: 'أدخل كلمة المرور الخاصة بك للمتابعة', password: 'كلمة المرور', login: 'دخول',
    driverDashboard: 'لوحة السائق', driver: 'السائق', logout: 'خروج', date: 'التاريخ', employee: 'اسم الموظف / الموظفة',
    chooseEmployee: 'اختر الموظف', paymentMethod: 'طريقة الدفع', amount: 'المبلغ', quickAmounts: 'مبالغ سريعة',
    addSession: 'إضافة جلسة', currentEntries: 'العمليات الحالية', total: 'الإجمالي', action: 'إجراء', submitAll: 'حفظ الكل',
    clearAll: 'مسح الكل', adminDashboard: 'لوحة الإدارة', adminHelp: 'مراجعة الإيرادات وإدارة السائقين والموظفين',
    fromDate: 'من تاريخ', toDate: 'إلى تاريخ', refresh: 'تحديث', totalRevenue: 'إجمالي الإيراد', totalSessions: 'عدد الجلسات',
    entries: 'الإيرادات', drivers: 'السائقين', employees: 'الموظفين', latestEntries: 'آخر العمليات', timestamp: 'وقت الإدخال',
    manageDrivers: 'إدارة السائقين', addDriver: 'إضافة سائق', manageEmployees: 'إدارة الموظفين', addEmployee: 'إضافة موظف',
    status: 'الحالة', active: 'نشط', inactive: 'موقوف', save: 'حفظ', cancel: 'إلغاء',
    loginFailed: 'كلمة المرور غير صحيحة أو الحساب غير نشط', networkError: 'تعذر الاتصال بالخادم',
    selectEmployeeError: 'اختر الموظف أولًا', paymentError: 'اختر طريقة الدفع', amountError: 'أدخل مبلغًا صحيحًا أكبر من صفر',
    entryAdded: 'تمت إضافة الجلسة', noEntries: 'لا توجد عمليات حالية', submitSuccess: 'تم حفظ العمليات بنجاح',
    submitEmpty: 'أضف عملية واحدة على الأقل', dashboardLoaded: 'تم تحديث البيانات', add: 'إضافة', edit: 'تعديل', disable: 'إيقاف', enable: 'تفعيل',
    driverName: 'اسم السائق', employeeName: 'اسم الموظف', generatedPassword: 'كلمة المرور', all: 'الكل',
    tip: 'البقشيش', monthlyRevenue: 'إيراد الموظفين الشهري', sessions: 'الجلسات', serviceAmount: 'الإيراد', tipAmount: 'البقشيش'
  },
  en: {
    loginTitle: 'Login', loginHelp: 'Enter your password to continue', password: 'Password', login: 'Login',
    driverDashboard: 'Driver Dashboard', driver: 'Driver', logout: 'Logout', date: 'Date', employee: 'Employee',
    chooseEmployee: 'Choose employee', paymentMethod: 'Payment Method', amount: 'Amount', quickAmounts: 'Quick Amounts',
    addSession: 'Add Session', currentEntries: 'Current Entries', total: 'Total', action: 'Action', submitAll: 'Submit All',
    clearAll: 'Clear All', adminDashboard: 'Admin Dashboard', adminHelp: 'Review revenues and manage drivers and employees',
    fromDate: 'From Date', toDate: 'To Date', refresh: 'Refresh', totalRevenue: 'Total Revenue', totalSessions: 'Total Sessions',
    entries: 'Entries', drivers: 'Drivers', employees: 'Employees', latestEntries: 'Latest Entries', timestamp: 'Timestamp',
    manageDrivers: 'Manage Drivers', addDriver: 'Add Driver', manageEmployees: 'Manage Employees', addEmployee: 'Add Employee',
    status: 'Status', active: 'Active', inactive: 'Inactive', save: 'Save', cancel: 'Cancel',
    loginFailed: 'Invalid password or inactive account', networkError: 'Unable to reach the server',
    selectEmployeeError: 'Select an employee first', paymentError: 'Select a payment method', amountError: 'Enter a valid amount greater than zero',
    entryAdded: 'Session added', noEntries: 'No current entries', submitSuccess: 'Entries saved successfully',
    submitEmpty: 'Add at least one entry', dashboardLoaded: 'Dashboard refreshed', add: 'Add', edit: 'Edit', disable: 'Disable', enable: 'Enable',
    driverName: 'Driver Name', employeeName: 'Employee Name', generatedPassword: 'Password', all: 'All',
    tip: 'Tip', monthlyRevenue: 'Monthly Employee Revenue', sessions: 'Sessions', serviceAmount: 'Revenue', tipAmount: 'Tip'
  }
};

const els = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheDom();
  setTodayDates();
  bindEvents();
  applyLanguage();
  renderDraftEntries();
});

function cacheDom() {
  Object.assign(els, {
    loginView: document.getElementById('loginView'), driverView: document.getElementById('driverView'), adminView: document.getElementById('adminView'),
    loginForm: document.getElementById('loginForm'), passwordInput: document.getElementById('passwordInput'), loginBtn: document.getElementById('loginBtn'), loginMessage: document.getElementById('loginMessage'),
    langToggle: document.getElementById('langToggle'), driverNameText: document.getElementById('driverNameText'), entryDate: document.getElementById('entryDate'),
    employeeGrid: document.getElementById('employeeGrid'), amountInput: document.getElementById('amountInput'), tipInput: document.getElementById('tipInput'), addEntryBtn: document.getElementById('addEntryBtn'), driverMessage: document.getElementById('driverMessage'),
    entriesCardList: document.getElementById('entriesCardList'), liveTotal: document.getElementById('liveTotal'), submitEntriesBtn: document.getElementById('submitEntriesBtn'), clearEntriesBtn: document.getElementById('clearEntriesBtn'),
    logoutDriverBtn: document.getElementById('logoutDriverBtn'), logoutAdminBtn: document.getElementById('logoutAdminBtn'),
    adminFromDate: document.getElementById('adminFromDate'), adminToDate: document.getElementById('adminToDate'), adminDriverFilter: document.getElementById('adminDriverFilter'),
    adminEmployeeFilter: document.getElementById('adminEmployeeFilter'), refreshDashboardBtn: document.getElementById('refreshDashboardBtn'), adminMessage: document.getElementById('adminMessage'),
    statTotalRevenue: document.getElementById('statTotalRevenue'), statTotalSessions: document.getElementById('statTotalSessions'), statCash: document.getElementById('statCash'), statCard: document.getElementById('statCard'), statApp: document.getElementById('statApp'),
    statWallet: document.getElementById('statWallet'), statTip: document.getElementById('statTip'),
    adminEntriesBody: document.getElementById('adminEntriesBody'), driversBody: document.getElementById('driversBody'), employeesBody: document.getElementById('employeesBody'),
    monthlyBody: document.getElementById('monthlyBody'), monthlyFilter: document.getElementById('monthlyFilter'),
    openAddDriverModal: document.getElementById('openAddDriverModal'), openAddEmployeeModal: document.getElementById('openAddEmployeeModal'),
    modalOverlay: document.getElementById('modalOverlay'), modalTitle: document.getElementById('modalTitle'), modalForm: document.getElementById('modalForm'), closeModalBtn: document.getElementById('closeModalBtn')
  });
}

function bindEvents() {
  els.langToggle.addEventListener('click', toggleLanguage);
  document.getElementById('togglePassword')?.addEventListener('click', function() {
    const type = els.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    els.passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '🔒';
  });
  els.loginForm.addEventListener('submit', onLogin);
  els.addEntryBtn.addEventListener('click', addDraftEntry);
  els.submitEntriesBtn.addEventListener('click', submitDraftEntries);
  els.clearEntriesBtn.addEventListener('click', clearDraftEntries);
  els.logoutDriverBtn.addEventListener('click', logout);
  els.logoutAdminBtn.addEventListener('click', logout);
  els.refreshDashboardBtn.addEventListener('click', loadDashboard);
  els.monthlyFilter.addEventListener('change', loadMonthlyRevenue);
  els.openAddDriverModal.addEventListener('click', () => openDriverModal());
  els.openAddEmployeeModal.addEventListener('click', () => openEmployeeModal());
  els.closeModalBtn.addEventListener('click', closeModal);
  document.querySelectorAll('.payment-btn').forEach(btn => btn.addEventListener('click', () => setPayment(btn.dataset.payment, btn)));
  document.querySelectorAll('.quick-btn').forEach(btn => btn.addEventListener('click', () => {
    const amount = Number(btn.dataset.amount || 0);
    els.amountInput.value = (Number(els.amountInput.value || 0) + amount).toFixed(2);
  }));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab, btn)));
}

function setTodayDates() {
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = new Date().toISOString().slice(0, 7);
  ['entryDate', 'adminFromDate', 'adminToDate'].forEach(id => document.getElementById(id).value = today);
  if (els.monthlyFilter) els.monthlyFilter.value = currentMonth;
}

function toggleLanguage() {
  state.lang = state.lang === 'ar' ? 'en' : 'ar';
  applyLanguage();
}

function applyLanguage() {
  const lang = state.lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  els.langToggle.textContent = lang === 'ar' ? 'EN' : 'AR';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });
  const appTitle = document.getElementById('appTitle');
  const appSubtitle = document.getElementById('appSubtitle');
  appTitle.textContent = lang === 'ar' ? window.APP_CONFIG.APP_NAME_AR : window.APP_CONFIG.APP_NAME_EN;
  appSubtitle.textContent = 'EHTIMAM - ' + (lang === 'ar' ? 'Daily Revenue Recording System' : 'Daily Revenue Recording System');
  renderEmployees();
  renderDraftEntries();
  renderAdminOptions();
}

async function onLogin(event) {
  event.preventDefault();
  setMessage(els.loginMessage, '');
  const password = els.passwordInput.value.trim();
  if (!password) return;
  setLoading(els.loginBtn, true);
  try {
    const result = await apiGet('login', { password });
    if (!result.success) {
      setMessage(els.loginMessage, t('loginFailed'));
      return;
    }
    state.user = result.user;
    els.passwordInput.value = '';
    if (state.user.role === 'driver') {
      await bootDriver();
    } else {
      await bootAdmin();
    }
  } catch (error) {
    setMessage(els.loginMessage, t('networkError'));
  } finally {
    setLoading(els.loginBtn, false);
  }
}

async function bootDriver() {
  switchView('driver');
  els.driverNameText.textContent = state.user.driverName || '-';
  state.draftEntries = [];
  state.currentPayment = '';
  state.currentEmployee = '';
  highlightPaymentButton();
  renderDraftEntries();
  if (!state.employees.length) {
    const employeesResult = await apiGet('getEmployees');
    state.employees = employeesResult.items || [];
  }
  renderEmployees();
}

async function bootAdmin() {
  switchView('admin');
  if (!state.employees.length) {
    const employeesResult = await apiGet('getEmployees');
    state.employees = employeesResult.items || [];
  }
  await loadDashboard();
  
  // تفعيل تبويب الإيرادات تلقائياً عند الدخول لضمان ظهور المحتوى
  const entriesTabBtn = document.querySelector('.tab-btn[data-tab="entriesTab"]');
  if (entriesTabBtn) {
    switchAdminTab('entriesTab', entriesTabBtn);
  }
}

function switchView(view) {
  [els.loginView, els.driverView, els.adminView].forEach(v => v.classList.add('hidden'));
  els.loginView.classList.remove('active');
  els.driverView.classList.remove('active');
  els.adminView.classList.remove('active');
  if (view === 'driver') {
    els.driverView.classList.remove('hidden');
    els.driverView.classList.add('active');
  } else if (view === 'admin') {
    els.adminView.classList.remove('hidden');
    els.adminView.classList.add('active');
  } else {
    els.loginView.classList.remove('hidden');
    els.loginView.classList.add('active');
  }
}

function logout() {
  state.user = null;
  state.draftEntries = [];
  switchView('login');
  setMessage(els.loginMessage, '');
}

function renderEmployees() {
  els.employeeGrid.innerHTML = '';
  const activeEmployees = state.employees.filter(e => e.status === 'active');
  
  if (activeEmployees.length === 0) {
    els.employeeGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">${t('noEntries')}</p>`;
    return;
  }
  
  activeEmployees.forEach(item => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `employee-card ${state.currentEmployee === item.name ? 'active' : ''}`;
    card.textContent = item.name;
    card.addEventListener('click', () => {
      state.currentEmployee = item.name;
      renderEmployees();
    });
    els.employeeGrid.appendChild(card);
  });
}

function setPayment(payment, button) {
  state.currentPayment = payment;
  highlightPaymentButton(button);
}

function highlightPaymentButton(activeButton) {
  document.querySelectorAll('.payment-btn').forEach(btn => {
    btn.classList.remove('active');
    if ((activeButton && btn === activeButton) || (!activeButton && btn.dataset.payment === state.currentPayment)) {
      btn.classList.add('active');
    }
  });
}

function addDraftEntry() {
  setMessage(els.driverMessage, '');
  const employee = state.currentEmployee;
  const payment = state.currentPayment;
  const serviceAmount = Number(els.amountInput.value);
  const tipAmount = Number(els.tipInput.value || 0);
  if (!employee) return setMessage(els.driverMessage, t('selectEmployeeError'));
  if (!payment) return setMessage(els.driverMessage, t('paymentError'));
  if (!serviceAmount || serviceAmount <= 0) return setMessage(els.driverMessage, t('amountError'));

  state.draftEntries.push({ 
    employee, 
    paymentMethod: payment, 
    serviceAmount: round2(serviceAmount),
    tipAmount: round2(tipAmount),
    totalAmount: round2(serviceAmount + tipAmount),
    amount: round2(serviceAmount + tipAmount) // الحفاظ على التوافقية مع الـ Backend القديم
  });
  els.amountInput.value = '';
  els.tipInput.value = '';
  setMessage(els.driverMessage, t('entryAdded'), 'success');
  renderDraftEntries();
}

function renderDraftEntries() {
  els.entriesCardList.innerHTML = '';
  if (!state.draftEntries.length) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.gridColumn = '1/-1';
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.color = 'var(--text-secondary)';
    emptyMsg.style.padding = '20px';
    emptyMsg.textContent = t('noEntries');
    els.entriesCardList.appendChild(emptyMsg);
  } else {
    state.draftEntries.forEach((entry, index) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      const paymentIcon = entry.paymentMethod === 'Cash' ? '💵' : entry.paymentMethod === 'Card' ? '💳' : entry.paymentMethod === 'App' ? '📱' : '👛';
      const tipText = entry.tipAmount > 0 ? ` (+${formatMoney(entry.tipAmount)} Tip)` : '';
      card.innerHTML = `
        <div class="entry-card-header">
          <div class="entry-card-info">
            <div class="entry-card-employee">${entry.employee}</div>
            <div class="entry-card-payment"><span class="payment-icon">${paymentIcon}</span> ${entry.paymentMethod}</div>
          </div>
          <button type="button" class="entry-card-delete" data-remove-index="${index}">×</button>
        </div>
        <div class="entry-card-amount">${formatMoney(entry.serviceAmount || entry.amount)}${tipText} = ${formatMoney(entry.totalAmount || entry.amount)} SAR</div>
      `;
      els.entriesCardList.appendChild(card);
    });
    els.entriesCardList.querySelectorAll('[data-remove-index]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.draftEntries.splice(Number(btn.dataset.removeIndex), 1);
        renderDraftEntries();
      });
    });
  }
  els.liveTotal.textContent = formatMoney(state.draftEntries.reduce((sum, item) => sum + (item.totalAmount || item.amount), 0));
}

function clearDraftEntries() {
  state.draftEntries = [];
  renderDraftEntries();
}

async function submitDraftEntries() {
  setMessage(els.driverMessage, '');
  if (!state.draftEntries.length) return setMessage(els.driverMessage, t('submitEmpty'));
  const payload = {
    date: els.entryDate.value,
    driver: state.user.driverName,
    entries: state.draftEntries
  };
  setLoading(els.submitEntriesBtn, true);
  try {
    const result = await apiPost('submitEntries', payload);
    if (!result.success) throw new Error(result.message || 'submit failed');
    setMessage(els.driverMessage, t('submitSuccess'), 'success');
    state.draftEntries = [];
    renderDraftEntries();
  } catch (error) {
    setMessage(els.driverMessage, error.message || t('networkError'));
  } finally {
    setLoading(els.submitEntriesBtn, false);
  }
}
async function loadDashboard() {
  setLoading(els.refreshDashboardBtn, true);
  setMessage(els.adminMessage, '');
  try {
    const filters = {
      fromDate: els.adminFromDate.value,
      toDate: els.adminToDate.value,
      driver: els.adminDriverFilter.value,
      employee: els.adminEmployeeFilter.value,
    };
    const result = await apiGet('getDashboard', filters);
    state.dashboard = result;
    state.drivers = result.drivers || [];
    renderDashboard();
    loadMonthlyRevenue(); // تحميل البيانات الشهرية
    setMessage(els.adminMessage, t('dashboardLoaded'), 'success');
  } catch (error) {
    setMessage(els.adminMessage, t('networkError'));
  } finally {
    setLoading(els.refreshDashboardBtn, false);
  }
}

function renderDashboard() {
  const summary = state.dashboard?.summary || {};
  els.statTotalRevenue.textContent = formatMoney(summary.totalRevenue || 0);
  els.statTotalSessions.textContent = String(summary.totalSessions || 0);
  els.statCash.textContent = formatMoney(summary.cash || 0);
  els.statCard.textContent = formatMoney(summary.card || 0);
  els.statApp.textContent = formatMoney(summary.app || 0);
  els.statWallet.textContent = formatMoney(summary.wallet || 0);
  els.statTip.textContent = formatMoney(summary.totalTip || 0);
}

async function loadMonthlyRevenue() {
  if (!els.monthlyFilter.value) return;
  try {
    const result = await apiGet('getEmployeeMonthly', { month: els.monthlyFilter.value });
    renderMonthlyRevenue(result.items || []);
  } catch (error) {
    console.error('Failed to load monthly revenue', error);
  }
}

function renderMonthlyRevenue(items) {
  els.monthlyBody.innerHTML = '';
  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.sessions}</td>
      <td>${formatMoney(item.serviceTotal)}</td>
      <td>${formatMoney(item.tipTotal)}</td>
      <td><strong>${formatMoney(item.total)}</strong></td>
    `;
    els.monthlyBody.appendChild(tr);
  });
}
  els.adminEntriesBody.innerHTML = '';
  (state.dashboard?.entries || []).forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.driver}</td>
      <td>${item.employee}</td>
      <td>${item.paymentMethod}</td>
      <td>${formatMoney(item.amount)}</td>
      <td>${item.timestamp}</td>
    `;
    els.adminEntriesBody.appendChild(row);
  });
  renderAdminOptions();
  renderDriversTable();
  renderEmployeesTable();
}

function renderAdminOptions() {
  fillSelect(els.adminDriverFilter, state.drivers.map(d => d.driverName || d.name), true);
  fillSelect(els.adminEmployeeFilter, state.employees.filter(e => e.status === 'active').map(e => e.name), true);
}

function fillSelect(select, values, withAll = false) {
  const current = select.value;
  select.innerHTML = '';
  if (withAll) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = t('all');
    select.appendChild(option);
  }
  [...new Set(values.filter(Boolean))].forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    if (value === current) option.selected = true;
    select.appendChild(option);
  });
}

function renderDriversTable() {
  els.driversBody.innerHTML = '';
  (state.drivers || []).forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.driverName}</td>
      <td>${item.passwordMasked || '••••'}</td>
      <td>${statusBadge(item.status)}</td>
      <td>
        <button class="secondary-btn small-btn" data-edit-driver='${encodeURIComponent(JSON.stringify(item))}'>${t('edit')}</button>
        <button class="secondary-btn small-btn" data-toggle-driver='${encodeURIComponent(JSON.stringify(item))}'>${item.status === 'active' ? t('disable') : t('enable')}</button>
      </td>
    `;
    els.driversBody.appendChild(row);
  });
  els.driversBody.querySelectorAll('[data-edit-driver]').forEach(btn => btn.addEventListener('click', () => openDriverModal(JSON.parse(decodeURIComponent(btn.dataset.editDriver)))));
  els.driversBody.querySelectorAll('[data-toggle-driver]').forEach(btn => btn.addEventListener('click', () => toggleDriverStatus(JSON.parse(decodeURIComponent(btn.dataset.toggleDriver)))));
}

function renderEmployeesTable() {
  els.employeesBody.innerHTML = '';
  state.employees.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${statusBadge(item.status)}</td>
      <td>
        <button class="secondary-btn small-btn" data-edit-employee='${encodeURIComponent(JSON.stringify(item))}'>${t('edit')}</button>
        <button class="secondary-btn small-btn" data-toggle-employee='${encodeURIComponent(JSON.stringify(item))}'>${item.status === 'active' ? t('disable') : t('enable')}</button>
      </td>
    `;
    els.employeesBody.appendChild(row);
  });
  els.employeesBody.querySelectorAll('[data-edit-employee]').forEach(btn => btn.addEventListener('click', () => openEmployeeModal(JSON.parse(decodeURIComponent(btn.dataset.editEmployee)))));
  els.employeesBody.querySelectorAll('[data-toggle-employee]').forEach(btn => btn.addEventListener('click', () => toggleEmployeeStatus(JSON.parse(decodeURIComponent(btn.dataset.toggleEmployee)))));
}

function statusBadge(status) {
  return `<span class="status-badge ${status === 'active' ? 'status-active' : 'status-inactive'}">${t(status)}</span>`;
}

function switchAdminTab(tabId, button) {
  // إزالة الفئة النشطة من جميع الأزرار
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  // إضافة الفئة النشطة للزر المختار
  button.classList.add('active');
  
  // إخفاء جميع اللوحات
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.add('hidden');
    panel.classList.remove('active');
  });
  
  // إظهار اللوحة المختارة
  const activePanel = document.getElementById(tabId);
  if (activePanel) {
    activePanel.classList.remove('hidden');
    activePanel.classList.add('active');
  }
  
  // تحديث البيانات بناءً على التبويب المختار
  if (tabId === 'driversTab') renderDriversTable();
  if (tabId === 'employeesTab') renderEmployeesTable();
  if (tabId === 'entriesTab') renderDashboard();
}

function openDriverModal(item = null) {
  els.modalTitle.textContent = item ? t('edit') + ' ' + t('driver') : t('addDriver');
  els.modalForm.innerHTML = `
    <label><span>${t('driverName')}</span><input name="driverName" value="${item?.driverName || ''}" required /></label>
    <label><span>${t('generatedPassword')}</span><input name="password" value="${item?.password || ''}" required /></label>
    <div class="actions-row"><button class="primary-btn" type="submit">${t('save')}</button><button class="secondary-btn" type="button" id="cancelModalBtn">${t('cancel')}</button></div>
  `;
  els.modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(els.modalForm);
    const payload = {
      driverName: formData.get('driverName').trim(),
      password: formData.get('password').trim(),
      status: item?.status || 'active',
      originalPassword: item?.password || ''
    };
    const result = await apiPost(item ? 'updateDriver' : 'addDriver', payload);
    if (result.success) {
      closeModal();
      await loadDashboard();
    }
  };
  openModal();
}

function openEmployeeModal(item = null) {
  els.modalTitle.textContent = item ? t('edit') + ' ' + t('employee') : t('addEmployee');
  els.modalForm.innerHTML = `
    <label><span>${t('employeeName')}</span><input name="name" value="${item?.name || ''}" required /></label>
    <div class="actions-row"><button class="primary-btn" type="submit">${t('save')}</button><button class="secondary-btn" type="button" id="cancelModalBtn">${t('cancel')}</button></div>
  `;
  els.modalForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(els.modalForm);
    const payload = {
      name: formData.get('name').trim(),
      status: item?.status || 'active',
      originalName: item?.name || ''
    };
    const result = await apiPost(item ? 'updateEmployee' : 'addEmployee', payload);
    if (result.success) {
      state.employees = (await apiGet('getEmployees')).items || [];
      closeModal();
      await loadDashboard();
    }
  };
  openModal();
}

async function toggleDriverStatus(item) {
  await apiPost('toggleDriverStatus', { password: item.password, status: item.status === 'active' ? 'inactive' : 'active' });
  await loadDashboard();
}

async function toggleEmployeeStatus(item) {
  await apiPost('toggleEmployeeStatus', { name: item.name, status: item.status === 'active' ? 'inactive' : 'active' });
  state.employees = (await apiGet('getEmployees')).items || [];
  await loadDashboard();
}

function openModal() {
  els.modalOverlay.classList.remove('hidden');
  document.getElementById('cancelModalBtn')?.addEventListener('click', closeModal);
}
function closeModal() { els.modalOverlay.classList.add('hidden'); }

function setLoading(button, isLoading) {
  button.disabled = isLoading;
  const original = button.dataset.originalText || button.textContent;
  button.dataset.originalText = original;
  button.textContent = isLoading ? '...' : original;
}

function setMessage(el, message, type = 'error') {
  el.textContent = message;
  el.style.color = type === 'success' ? 'var(--success)' : 'var(--danger)';
}
function t(key) { return i18n[state.lang][key] || key; }
function round2(value) { return Math.round(value * 100) / 100; }
function formatMoney(value) { return Number(value || 0).toFixed(2); }

async function apiGet(action, params = {}) {
  const url = new URL(window.APP_CONFIG.API_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  });
  const res = await fetch(url.toString());
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data;
}

async function apiPost(action, payload = {}) {
  const body = JSON.stringify({ action, payload });
  const res = await fetch(window.APP_CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data;
}
