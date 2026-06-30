// Units tab: add / edit / delete rented units.
function refreshOwnerSelect(){
  var sel = document.getElementById('unit-owner');
  var cur = sel.value;
  var owners = getOwners();
  sel.innerHTML = owners.length
    ? owners.map(function(o){ return '<option value="' + o.id + '">' + escapeHtml(o.name) + '</option>'; }).join('')
    : '<option value="">— add an owner first —</option>';
  if (cur) sel.value = cur;
}

function fillPosSelect(){
  var sel = document.getElementById('unit-pos');
  sel.innerHTML = GST_STATES.map(function(s){
    return '<option value="' + s.code + '">' + s.code + ' — ' + escapeHtml(s.name) + '</option>';
  }).join('');
  sel.value = '33';
}

function renderUnits(){
  var list = document.getElementById('units-list');
  var units = getUnits();
  if (!units.length){
    list.innerHTML = '<div class="empty">No units yet. Add one above.</div>';
    return;
  }
  list.innerHTML = units.map(function(u){
    var owner = getOwner(u.ownerId);
    var inter = isInterState(owner && owner.gstin, u.pos);
    var g = computeGst(u.rent, u.rate, inter);
    return '<div class="listcard"><div>' +
      '<strong>' + escapeHtml(u.tenant) + '</strong>' +
      '<span class="badge">' + (inter ? 'IGST' : 'CGST+SGST') + '</span>' +
      '<div class="meta">' + escapeHtml(owner ? owner.name : '—') + ' · ' +
        rupees(u.rent) + '/mo + ' + rupees(g.totalTax) + ' GST · PoS ' +
        escapeHtml(stateName(u.pos) || u.pos || '—') + '</div></div>' +
      '<div class="row-actions">' +
        '<button class="btn btn-ghost" data-edit-unit="' + u.id + '">Edit</button>' +
        '<button class="btn btn-danger" data-del-unit="' + u.id + '">Delete</button>' +
      '</div></div>';
  }).join('');
}

function fillUnitForm(u){
  document.getElementById('unit-id').value = u ? u.id : '';
  document.getElementById('unit-owner').value = u ? u.ownerId : (getOwners()[0] ? getOwners()[0].id : '');
  document.getElementById('unit-tenant').value = u ? u.tenant : '';
  document.getElementById('unit-tgstin').value = u ? (u.tgstin || '') : '';
  document.getElementById('unit-property').value = u ? (u.property || '') : '';
  document.getElementById('unit-rent').value = u ? u.rent : '';
  document.getElementById('unit-rate').value = u ? u.rate : 18;
  document.getElementById('unit-pos').value = u ? (u.pos || '33') : '33';
  document.getElementById('unit-sac').value = u ? (u.sac || '997212') : '997212';
  document.getElementById('unit-prefix').value = u ? (u.prefix || '') : '';
}

function initUnits(){
  fillPosSelect();
  refreshOwnerSelect();
  var form = document.getElementById('unit-form');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (!getOwners().length){ alert('Add an owner first (Owners tab).'); return; }
    upsertUnit({
      id: document.getElementById('unit-id').value || '',
      ownerId: document.getElementById('unit-owner').value,
      tenant: document.getElementById('unit-tenant').value.trim(),
      tgstin: document.getElementById('unit-tgstin').value.trim().toUpperCase(),
      property: document.getElementById('unit-property').value.trim(),
      rent: Number(document.getElementById('unit-rent').value) || 0,
      rate: Number(document.getElementById('unit-rate').value) || 18,
      pos: document.getElementById('unit-pos').value,
      sac: document.getElementById('unit-sac').value.trim() || '997212',
      prefix: document.getElementById('unit-prefix').value.trim().toUpperCase()
    });
    fillUnitForm(null);
    renderUnits(); renderDashboard();
  });
  document.getElementById('unit-reset').addEventListener('click', function(){ fillUnitForm(null); });
  document.getElementById('units-list').addEventListener('click', function(e){
    var ed = e.target.getAttribute('data-edit-unit');
    var dl = e.target.getAttribute('data-del-unit');
    if (ed){ fillUnitForm(getUnit(ed)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    if (dl){ if (confirm('Delete this unit?')){ deleteUnit(dl); renderUnits(); renderDashboard(); } }
  });
}
window.renderUnits = renderUnits; window.initUnits = initUnits;
window.refreshOwnerSelect = refreshOwnerSelect;
