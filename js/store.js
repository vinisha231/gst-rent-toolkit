// Local persistence. All data stays in the browser (localStorage). No server.
var STORE_KEY = 'gst_rent_toolkit_v1';

function blankState(){ return { owners: [], units: [], settings: { defaultRate: 18 } }; }

function loadState(){
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (!raw) return blankState();
    var s = JSON.parse(raw);
    s.owners = s.owners || [];
    s.units = s.units || [];
    s.settings = s.settings || { defaultRate: 18 };
    return s;
  } catch (e){ return blankState(); }
}

var STATE = loadState();

function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(STATE)); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// Owners -------------------------------------------------------------
function getOwners(){ return STATE.owners; }
function getOwner(id){ return STATE.owners.find(function(o){ return o.id === id; }); }
function upsertOwner(o){
  if (o.id){
    var i = STATE.owners.findIndex(function(x){ return x.id === o.id; });
    if (i >= 0) STATE.owners[i] = o;
  } else {
    o.id = uid();
    STATE.owners.push(o);
  }
  saveState();
  return o;
}
function deleteOwner(id){
  STATE.owners = STATE.owners.filter(function(o){ return o.id !== id; });
  STATE.units = STATE.units.filter(function(u){ return u.ownerId !== id; });
  saveState();
}

// Units --------------------------------------------------------------
function getUnits(){ return STATE.units; }
function getUnit(id){ return STATE.units.find(function(u){ return u.id === id; }); }
function upsertUnit(u){
  if (u.id){
    var i = STATE.units.findIndex(function(x){ return x.id === u.id; });
    if (i >= 0) STATE.units[i] = u;
  } else {
    u.id = uid();
    STATE.units.push(u);
  }
  saveState();
  return u;
}
function deleteUnit(id){
  STATE.units = STATE.units.filter(function(u){ return u.id !== id; });
  saveState();
}

// Import / export ----------------------------------------------------
function exportState(){ return JSON.stringify(STATE, null, 2); }
function importState(text){
  var s = JSON.parse(text);
  STATE = { owners: s.owners || [], units: s.units || [],
            settings: s.settings || { defaultRate: 18 } };
  saveState();
}
function clearState(){ STATE = blankState(); saveState(); }

window.STATE = STATE;
