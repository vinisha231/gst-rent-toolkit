# GST Rent Toolkit

A free, open-source, **privacy-first** helper for filing monthly **GST on rental
income** in India. Add your owners and rented units once, then every month it
gives you the exact **GSTR-1** and **GSTR-3B** figures — per GSTIN, ready to type
into the portal.

🔒 **Your data never leaves your device.** Everything is saved in your browser's
local storage. No login, no server, no tracking. Back it up to a file any time.

## ✨ Features

- **Monthly dashboard** — pick a month, see total GST to collect and pay.
- **Per-owner cards** — grouped by GSTIN, with the exact GSTR-3B 3.1(a) line.
- **Smart CGST/SGST vs IGST** — auto-detects intra-state vs inter-state from the
  owner's GSTIN and the place of supply.
- **GST calculator** — split any rent at any rate.
- **Add/edit owners & units** with a simple form.
- **Backup & restore** — export/import your data as JSON, move between devices.
- **Print / Save as PDF** for a clean monthly sheet.
- Works fully offline once loaded. No build step, no dependencies.

## 🚀 Use it

Open the live site (GitHub Pages), or download and open `index.html` in any
browser. First time? Go to the **Data** tab → **Load sample data** to see how it
works, then clear it and add your own.

## 🧮 How GST on commercial rent works

Commercial rent is taxed at **18% GST**. If the property and tenant are in the
**same state**, that's **9% CGST + 9% SGST**; if **different states**, it's **18%
IGST**. The toolkit applies the right split automatically. See [`docs/`](docs/).

## 🔐 Privacy

There is no backend. The app stores data only in `localStorage` on the device you
use. Clearing your browser data or using **Data → Clear everything** removes it.
See [`docs/privacy.md`](docs/privacy.md).

## 🛠 Tech

Plain HTML + CSS + vanilla JavaScript. Static, deployable anywhere (GitHub Pages,
Netlify, Vercel, Cloudflare Pages, or any web host).

---

⚠️ **Not tax advice.** A working aid to organise your numbers — always confirm the
final return with a qualified accountant / GST practitioner.

MIT licensed. Built by [vinisha231](https://github.com/vinisha231).
