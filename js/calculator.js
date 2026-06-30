// Standalone GST calculator.
function renderCalcOut(){
  var rent = document.getElementById('calc-rent').value;
  var rate = document.getElementById('calc-rate').value;
  var inter = document.getElementById('calc-inter').checked;
  var g = computeGst(rent, rate, inter);
  var out = document.getElementById('calc-out');
  var rows = '<div class="row"><span>Taxable rent</span><span>' + rupees(g.taxable) + '</span></div>';
  if (g.interState){
    rows += '<div class="row"><span>IGST @ ' + g.rate + '%</span><span>' + rupees(g.igst) + '</span></div>';
  } else {
    rows += '<div class="row"><span>CGST @ ' + (g.rate / 2) + '%</span><span>' + rupees(g.cgst) + '</span></div>';
    rows += '<div class="row"><span>SGST @ ' + (g.rate / 2) + '%</span><span>' + rupees(g.sgst) + '</span></div>';
  }
  rows += '<div class="row"><span>Total tax</span><span>' + rupees(g.totalTax) + '</span></div>';
  rows += '<div class="row tot"><span>Gross invoice</span><span>' + rupees(g.total) + '</span></div>';
  out.innerHTML = rows;
}

function initCalculator(){
  ['calc-rent', 'calc-rate'].forEach(function(id){
    document.getElementById(id).addEventListener('input', renderCalcOut);
  });
  document.getElementById('calc-inter').addEventListener('change', renderCalcOut);
  renderCalcOut();
}
window.initCalculator = initCalculator;
