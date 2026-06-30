// Demo data so a first-time visitor can see how the tool works.
function loadSampleData(){
  clearState();
  var o1 = upsertOwner({ name: "Demo Landlord", gstin: "33ABCDE1234F1Z5" });
  var o2 = upsertOwner({ name: "Second Owner", gstin: "33PQRSX6789K1Z2" });
  upsertUnit({ ownerId: o1.id, tenant: "Cafe Aroma Pvt Ltd", tgstin: "33AAACC1111A1Z0",
    property: "Shop 1, Main Road", rent: 60000, rate: 18, pos: "33", sac: "997212", prefix: "DL" });
  upsertUnit({ ownerId: o1.id, tenant: "BrightWear Retail", tgstin: "33AAACB2222B1Z9",
    property: "Shop 2, Main Road", rent: 95000, rate: 18, pos: "33", sac: "997212", prefix: "DL" });
  upsertUnit({ ownerId: o2.id, tenant: "TechNova LLP", tgstin: "29AAACT3333C1Z8",
    property: "Office 4, IT Park", rent: 150000, rate: 18, pos: "29", sac: "997212", prefix: "SO" });
}
window.loadSampleData = loadSampleData;
