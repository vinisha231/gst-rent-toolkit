// App bootstrap: tab switching + initial render.
(function(){
  function switchTab(name){
    document.querySelectorAll('.tab').forEach(function(t){
      t.classList.toggle('is-active', t.getAttribute('data-tab') === name);
    });
    document.querySelectorAll('.view').forEach(function(v){
      v.classList.toggle('is-active', v.id === 'view-' + name);
    });
  }

  function init(){
    // default month = current month, YYYY-MM
    var now = new Date();
    var mi = document.getElementById('month-input');
    mi.value = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    mi.addEventListener('change', renderDashboard);

    document.getElementById('tabs').addEventListener('click', function(e){
      var name = e.target.getAttribute('data-tab');
      if (name) switchTab(name);
    });
    document.getElementById('print-btn').addEventListener('click', function(){ window.print(); });
    document.getElementById('add-unit-shortcut').addEventListener('click', function(){
      switchTab('units');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var t = document.getElementById('unit-tenant'); if (t) t.focus();
    });

    initOwners();
    initUnits();
    initCalculator();
    initDataTab();
    initDashboardInlineEdit();

    renderOwners();
    renderUnits();
    renderDashboard();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
