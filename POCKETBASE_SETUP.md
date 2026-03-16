# PocketBase Backend Setup — Nura Bahar

## Step 1 — Download PocketBase

Go to https://pocketbase.io/docs and download the Mac version.

Place it in:
```
femme-boutique/backend/pocketbase
```

Make it executable:
```bash
chmod +x femme-boutique/backend/pocketbase
```

## Step 2 — Run PocketBase

```bash
./femme-boutique/backend/pocketbase serve
```

Open http://127.0.0.1:8090/_/ and create your admin account.

## Step 3 — Create Collections

In the PocketBase admin UI, create these 3 collections:

### products
| Field         | Type   | Options              |
|---------------|--------|----------------------|
| name          | Text   | Required             |
| category      | Text   | Required             |
| price         | Number | Required             |
| originalPrice | Number | Optional             |
| description   | Text   | Required             |
| colors        | JSON   |                      |
| sizes         | JSON   |                      |
| images        | File   | Multiple, Max 5      |
| badge         | Text   | Optional             |
| featured      | Bool   | Default: false       |
| rating        | Number | Default: 5           |
| stock         | Number | Default: 10          |

### orders
| Field        | Type   |
|--------------|--------|
| customerName | Text   |
| email        | Text   |
| phone        | Text   |
| address      | Text   |
| city         | Text   |
| state        | Text   |
| items        | JSON   |
| subtotal     | Number |
| shipping     | Number |
| total        | Number |
| status       | Text   |

### reviews
| Field   | Type              |
|---------|-------------------|
| product | Relation→products |
| name    | Text              |
| rating  | Number            |
| comment | Text              |

## Step 4 — Install dependencies & run

```bash
cd femme-boutique
npm install
npm run dev
```

## Step 5 — Admin credentials

- Store admin: http://localhost:5173/admin
- Default login: admin@nurabahar.ng / NuraBahar2025!
- PocketBase admin: http://127.0.0.1:8090/_/

## Notes

- The app works WITHOUT PocketBase running — it falls back to static product data
- The sidebar shows "PocketBase Connected" or "Offline Mode" so you always know the status
- Orders are only saved when PocketBase is running
- Add your video at: public/videos/nurabahar.mp4
