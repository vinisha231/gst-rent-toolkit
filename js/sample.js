// Demo data so a first-time visitor can see how the tool works.
// All values below are fictional placeholders — not real people or businesses.
function loadSampleData(){
  clearState();
  var o1 = upsertOwner({ name: "ABC Properties", gstin: "22ABCDE1234F1Z5" });
  var o2 = upsertOwner({ name: "XYZ Estates", gstin: "22XYZAB6789K1Z2" });
  upsertUnit({ ownerId: o1.id, tenant: "ABC Traders", tgstin: "22AAACC1111A1Z0",
    property: "Shop 1, Sample Road", rent: 50000, rate: 18, pos: "22", sac: "997212", prefix: "AB" });
  upsertUnit({ ownerId: o1.id, tenant: "ABC Foods", tgstin: "22AAACB2222B1Z9",
    property: "Shop 2, Sample Road", rent: 75000, rate: 18, pos: "22", sac: "997212", prefix: "AB" });
  upsertUnit({ ownerId: o2.id, tenant: "XYZ Tech LLP", tgstin: "29AAACT3333C1Z8",
    property: "Office 4, Sample Park", rent: 120000, rate: 18, pos: "29", sac: "997212", prefix: "XY" });
}
window.loadSampleData = loadSampleData;
