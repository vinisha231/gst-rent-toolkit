// GST computation. Same-state -> CGST + SGST; different state -> IGST.
function stateCodeFromGstin(g){ return (g || '').trim().slice(0, 2); }

function computeGst(rent, rate, interState){
  rent = Number(rent) || 0;
  rate = Number(rate); if (isNaN(rate)) rate = 18;
  if (interState){
    var igst = Math.round(rent * rate / 100);
    return { taxable: rent, igst: igst, cgst: 0, sgst: 0,
             totalTax: igst, total: rent + igst, rate: rate, interState: true };
  }
  var half = Math.round(rent * rate / 200); // half the rate, each side
  return { taxable: rent, igst: 0, cgst: half, sgst: half,
           totalTax: half * 2, total: rent + half * 2, rate: rate, interState: false };
}

// Decide inter-state from supplier GSTIN vs place-of-supply state code.
function isInterState(ownerGstin, posCode){
  var sup = stateCodeFromGstin(ownerGstin);
  if (!sup || !posCode) return false;       // assume intra-state if unknown
  return sup !== posCode;
}
window.computeGst = computeGst;
window.isInterState = isInterState;
window.stateCodeFromGstin = stateCodeFromGstin;
