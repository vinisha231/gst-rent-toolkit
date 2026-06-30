// Owners tab: add / edit / delete GST registrations.
function renderOwners(){
  var list = document.getElementById('owners-list');
  var owners = getOwners();
  if (!owners.length){
    list.innerHTML = '<div class="empty">No owners yet. Add one above, or load sample data from the Data tab.</div>';
    return;
  }
  list.innerHTML = owners.map(function(o){
    var sc = stateCodeFromGstin(o.gstin);
    var units = getUnits().filter(function(u){ return u.ownerId === o.id; }).length;
    return '<div class="listcard"><div>' +
      '<strong>' + escapeHtml(o.name) + '</strong><span class="badge">' + units + ' unit' +
        (units === 1 ? '' : 's') + '</span>' +
      '<div class="meta mono">' + escapeHtml(o.gstin || 'no GSTIN') +
        (sc ? ' · ' + escapeHtml(stateName(sc)) : '') + '</div></div>' +
      '<div class="row-actions">' +
        '<button class="btn btn-ghost" data-edit-owner="' + o.id + '">Edit</button>' +
        '<button class="btn btn-danger" data-del-owner="' + o.id + '">Delete</button>' +
      '</div></div>';
  }).join('');
}

function fillOwnerForm(o){
  document.getElementById('owner-id').value = o ? o.id : '';
  document.getElementById('owner-name').value = o ? o.name : '';
  document.getElementById('owner-gstin').value = o ? (o.gstin || '') : '';
}

function initOwners(){
  var form = document.getElementById('owner-form');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    upsertOwner({
      id: document.getElementById('owner-id').value || '',
      name: document.getElementById('owner-name').value.trim(),
      gstin: document.getElementById('owner-gstin').value.trim().toUpperCase()
    });
    fillOwnerForm(null);
    renderOwners(); refreshOwnerSelect(); renderDashboard();
  });
  document.getElementById('owner-reset').addEventListener('click', function(){ fillOwnerForm(null); });
  document.getElementById('owners-list').addEventListener('click', function(e){
    var ed = e.target.getAttribute('data-edit-owner');
    var dl = e.target.getAttribute('data-del-owner');
    if (ed){ fillOwnerForm(getOwner(ed)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    if (dl){
      if (confirm('Delete this owner and all its units?')){
        deleteOwner(dl); renderOwners(); refreshOwnerSelect(); renderUnits(); renderDashboard();
      }
    }
  });
}
window.renderOwners = renderOwners; window.initOwners = initOwners;
