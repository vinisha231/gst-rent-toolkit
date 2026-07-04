// Dashboard: for the chosen month, build invoices per owner and the GSTR figures.
function fyOf(y, m){ // m is 1-12
  return m >= 4 ? (y + '-' + String(y + 1).slice(2)) : ((y - 1) + '-' + String(y).slice(2));
}
function monthLabel(y, m){
  var names = ['January','February','March','April','May','June','July',
               'August','September','October','November','December'];
  return names[m - 1] + ' ' + y;
}
function dueDates(y, m){
  var ny = m === 12 ? y + 1 : y, nm = m === 12 ? 1 : m + 1;
  var mm = String(nm).padStart(2, '0');
  return { gstr1: ny + '-' + mm + '-11', gstr3b: ny + '-' + mm + '-20' };
}

function buildInvoices(y, m){
  var fy = fyOf(y, m);
  var byOwner = {};
  getOwners().forEach(function(o){ byOwner[o.id] = { owner: o, rows: [], seq: 0 }; });
  getUnits().forEach(function(u){
    var grp = byOwner[u.ownerId]; if (!grp) return;
    grp.seq += 1;
    var owner = grp.owner;
    var inter = isInterState(owner.gstin, u.pos);
    var g = computeGst(u.rent, u.rate, inter);
    var prefix = u.prefix || (owner.name || 'INV').replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'INV';
    grp.rows.push({
      unitId: u.id, tenant: u.tenant, tgstin: u.tgstin, property: u.property,
      invoiceNo: prefix + '/' + String(grp.seq).padStart(2, '0') + '/' + fy,
      taxable: g.taxable, cgst: g.cgst, sgst: g.sgst, igst: g.igst,
      totalTax: g.totalTax, total: g.total, rate: g.rate, inter: inter
    });
  });
  return byOwner;
}

function sumRows(rows, key){ return rows.reduce(function(a, r){ return a + r[key]; }, 0); }

function renderDashboard(){
  var body = document.getElementById('dashboard-body');
  var val = document.getElementById('month-input').value;
  if (!val){ return; }
  var parts = val.split('-'); var y = +parts[0], m = +parts[1];
  var due = dueDates(y, m);
  document.getElementById('due-dates').textContent =
    'GSTR-1 due ' + due.gstr1 + '  •  GSTR-3B due ' + due.gstr3b;

  if (!getOwners().length || !getUnits().length){
    body.innerHTML = '<div class="empty">Add at least one <b>owner</b> and one <b>unit</b> to see the ' +
      'monthly GST summary.<br>New here? Open the <b>Data</b> tab and click <b>Load sample data</b>.</div>';
    return;
  }

  var byOwner = buildInvoices(y, m);
  var all = [];
  Object.keys(byOwner).forEach(function(k){ all = all.concat(byOwner[k].rows); });

  var html = '<h2 style="margin:0 0 6px">' + monthLabel(y, m) + ' — total to collect &amp; pay</h2>';
  html += '<div class="totals-grid">' +
    stat('Taxable rent', sumRows(all, 'taxable')) +
    stat('CGST', sumRows(all, 'cgst')) +
    stat('SGST', sumRows(all, 'sgst')) +
    stat('Total GST (incl. IGST ' + rupees(sumRows(all, 'igst')) + ')', sumRows(all, 'totalTax'), true) +
    '</div>';

  html += '<h2 style="margin:18px 0 6px">By owner (GSTIN)</h2>' +
          '<p class="muted" style="margin:0 0 14px">Each owner files their own GSTR-1 and GSTR-3B with these figures.</p>';

  getOwners().forEach(function(o){
    var grp = byOwner[o.id];
    if (!grp || !grp.rows.length) return;
    html += ownerCard(o, grp.rows);
  });

  body.innerHTML = html;
}

function stat(k, v, accent){
  return '<div class="stat' + (accent ? ' accent' : '') + '"><p class="k">' + k +
         '</p><p class="v">' + rupees(v) + '</p></div>';
}

function ownerCard(o, rows){
  var anyInter = rows.some(function(r){ return r.inter; });
  var head = '<tr><th>Tenant / Invoice</th><th>Taxable</th><th>CGST</th><th>SGST</th>' +
             (anyInter ? '<th>IGST</th>' : '') + '<th>Gross</th></tr>';
  var body = rows.map(function(r){
    return '<tr><td>' + escapeHtml(r.tenant) + '<div class="inv">' + escapeHtml(r.invoiceNo) +
      (r.tgstin ? ' · ' + escapeHtml(r.tgstin) : '') + '</div></td>' +
      '<td class="rent-cell"><input class="cell-rent" type="number" min="0" step="500" value="' +
        r.taxable + '" data-unit-rent="' + r.unitId + '" aria-label="Edit rent for ' + escapeHtml(r.tenant) + '" /></td>' +
      '<td>' + inr(r.cgst) + '</td><td>' + inr(r.sgst) + '</td>' +
      (anyInter ? '<td>' + inr(r.igst) + '</td>' : '') +
      '<td>' + inr(r.total) + '</td></tr>';
  }).join('');
  var tC = sumRows(rows, 'cgst'), tS = sumRows(rows, 'sgst'), tI = sumRows(rows, 'igst'),
      tX = sumRows(rows, 'taxable'), tT = sumRows(rows, 'total');
  var foot = '<tr><td>Total (' + rows.length + ' invoice' + (rows.length === 1 ? '' : 's') + ')</td>' +
      '<td>' + inr(tX) + '</td><td>' + inr(tC) + '</td><td>' + inr(tS) + '</td>' +
      (anyInter ? '<td>' + inr(tI) + '</td>' : '') + '<td>' + inr(tT) + '</td></tr>';
  var fileLine = 'GSTR-3B 3.1(a) → taxable <b>' + rupees(tX) + '</b>' +
      (tI ? ', IGST <b>' + rupees(tI) + '</b>' : '') +
      ', CGST <b>' + rupees(tC) + '</b>, SGST <b>' + rupees(tS) + '</b>';
  return '<div class="lcard">' +
    '<div class="lhead"><h3>' + escapeHtml(o.name) + '</h3>' +
      '<span class="gstin mono">' + escapeHtml(o.gstin || 'no GSTIN') + '</span></div>' +
    '<div class="tablewrap"><table class="reg"><thead>' + head + '</thead><tbody>' + body +
      '</tbody><tfoot>' + foot + '</tfoot></table></div>' +
    '<div class="file-line">' + fileLine + '</div></div>';
}

// Inline rent editing: change a rent right on the dashboard and the unit is
// updated in the store, then the figures recompute. Delegated on the persistent
// container so it survives re-renders; uses 'change' so focus isn't lost mid-typing.
function initDashboardInlineEdit(){
  var host = document.getElementById('dashboard-body');
  if (!host) return;
  host.addEventListener('change', function(e){
    var id = e.target.getAttribute('data-unit-rent');
    if (!id) return;
    var u = getUnit(id);
    if (!u) return;
    u.rent = Number(e.target.value) || 0;
    upsertUnit(u);
    renderDashboard();
    if (typeof renderUnits === 'function') renderUnits();
  });
}
window.renderDashboard = renderDashboard;
window.initDashboardInlineEdit = initDashboardInlineEdit;
