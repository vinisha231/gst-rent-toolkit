// Data tab: backup, restore, sample, clear.
function setDataStatus(msg){ document.getElementById('data-status').textContent = msg || ''; }

function refreshAll(){
  renderOwners(); refreshOwnerSelect(); renderUnits(); renderDashboard();
}

function initDataTab(){
  document.getElementById('data-export').addEventListener('click', function(){
    var blob = new Blob([exportState()], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gst-rent-toolkit-backup.json';
    document.body.appendChild(a); a.click(); a.remove();
    setDataStatus('Backup downloaded.');
  });

  document.getElementById('data-import-file').addEventListener('change', function(e){
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function(){
      try { importState(reader.result); refreshAll(); setDataStatus('Backup imported.'); }
      catch (err){ setDataStatus('Could not read that file — is it a valid backup?'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  document.getElementById('data-sample').addEventListener('click', function(){
    if (getOwners().length && !confirm('Replace current data with sample data?')) return;
    loadSampleData(); refreshAll(); setDataStatus('Sample data loaded.');
  });

  document.getElementById('data-clear').addEventListener('click', function(){
    if (confirm('Delete ALL owners and units from this browser? This cannot be undone.')){
      clearState(); refreshAll(); setDataStatus('All data cleared.');
    }
  });
}
window.initDataTab = initDataTab;
