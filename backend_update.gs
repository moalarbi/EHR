/**
 * Google Apps Script - Staging Backend Update
 * 
 * ميزات جديدة:
 * 1. دعم المحفظة (Wallet) كطريقة دفع.
 * 2. دعم البقشيش (Tip) في الإدخالات.
 * 3. تجميع الإيرادات الشهرية لكل موظف.
 * 4. الحفاظ على التوافقية مع البيانات القديمة.
 */

function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'getEmployees') {
    return handleGetEmployees();
  }
  
  if (action === 'getDashboard') {
    return handleGetDashboard(e.parameter);
  }
  
  if (action === 'getEmployeeMonthly') {
    return handleGetEmployeeMonthly(e.parameter.month);
  }
  
  if (action === 'login') {
    return handleLogin(e.parameter.password);
  }
  
  return createResponse({ success: false, message: 'Invalid action' });
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var action = data.action;
  
  if (action === 'submitEntries') {
    return handleSubmitEntries(data);
  }
  
  return createResponse({ success: false, message: 'Invalid action' });
}

/**
 * معالجة حفظ الإدخالات مع دعم البقشيش والمحفظة
 */
function handleSubmitEntries(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Entries');
  var date = data.date || new Date().toISOString().slice(0, 10);
  var driver = data.driver;
  var timestamp = new Date();
  
  data.entries.forEach(function(entry) {
    // الحفاظ على التوافقية: إذا لم يوجد serviceAmount نستخدم amount
    var serviceAmount = entry.serviceAmount !== undefined ? entry.serviceAmount : entry.amount;
    var tipAmount = entry.tipAmount || 0;
    var totalAmount = entry.totalAmount || (serviceAmount + tipAmount);
    
    // ترتيب الأعمدة المفترض (يجب التأكد من مطابقة ترتيب الأعمدة في الشيت الخاص بك)
    // التاريخ، السائق، الموظف، طريقة الدفع، المبلغ الأساسي، البقشيش، الإجمالي، وقت الإدخال
    sheet.appendRow([
      date,
      driver,
      entry.employee,
      entry.paymentMethod,
      serviceAmount,
      tipAmount,
      totalAmount,
      timestamp
    ]);
  });
  
  return createResponse({ success: true });
}

/**
 * تجميع البيانات للوحة الإدارة مع دعم المحفظة والبقشيش
 */
function handleGetDashboard(params) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Entries');
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  
  var fromDate = params.fromDate;
  var toDate = params.toDate;
  
  var summary = {
    totalRevenue: 0,
    totalSessions: 0,
    totalTip: 0,
    cash: 0,
    card: 0,
    app: 0,
    wallet: 0
  };
  
  data.forEach(function(row) {
    var rowDate = row[0]; // التاريخ في العمود الأول
    if (typeof rowDate !== 'string') rowDate = Utilities.formatDate(rowDate, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
    
    if (rowDate >= fromDate && rowDate <= toDate) {
      var paymentMethod = row[3];
      var serviceAmount = row[4] || 0;
      var tipAmount = row[5] || 0;
      var totalAmount = row[6] || serviceAmount; // التوافقية مع القديم
      
      summary.totalRevenue += serviceAmount;
      summary.totalTip += tipAmount;
      summary.totalSessions++;
      
      if (paymentMethod === 'Cash') summary.cash += serviceAmount;
      else if (paymentMethod === 'Card') summary.card += serviceAmount;
      else if (paymentMethod === 'App') summary.app += serviceAmount;
      else if (paymentMethod === 'Wallet') summary.wallet += serviceAmount;
    }
  });
  
  return createResponse({ 
    success: true, 
    summary: summary 
  });
}

/**
 * تجميع الإيرادات الشهرية لكل موظف
 */
function handleGetEmployeeMonthly(monthStr) {
  // monthStr format: "YYYY-MM"
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Entries');
  var data = sheet.getDataRange().getValues();
  data.shift(); // remove headers
  
  var aggregation = {};
  
  data.forEach(function(row) {
    var rowDate = row[0];
    if (typeof rowDate !== 'string') rowDate = Utilities.formatDate(rowDate, ss.getSpreadsheetTimeZone(), "yyyy-MM");
    else rowDate = rowDate.slice(0, 7);
    
    if (rowDate === monthStr) {
      var empName = row[2];
      var serviceAmount = row[4] || 0;
      var tipAmount = row[5] || 0;
      var totalAmount = row[6] || serviceAmount;
      
      if (!aggregation[empName]) {
        aggregation[empName] = {
          name: empName,
          serviceTotal: 0,
          tipTotal: 0,
          total: 0,
          sessions: 0
        };
      }
      
      aggregation[empName].serviceTotal += serviceAmount;
      aggregation[empName].tipTotal += tipAmount;
      aggregation[empName].total += (serviceAmount + tipAmount);
      aggregation[empName].sessions++;
    }
  });
  
  var items = Object.keys(aggregation).map(function(key) {
    return aggregation[key];
  });
  
  return createResponse({ success: true, items: items });
}

function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
