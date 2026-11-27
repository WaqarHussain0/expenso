# CSV import & export

How the three data-transfer features work, the limits that protect them, and
where the code lives. The user-facing version is in the in-app guide
(`/guide#categories`, `/guide#stats`).

| Feature         | Where                        | Delivery                                                     |
| --------------- | ---------------------------- | ------------------------------------------------------------ |
| Stats export    | Stats page → **Export CSV**  | Email with CSV attached, sent in the background (`after()`)  |
| Category export | Categories page → **Export** | Immediate browser download                                   |
| Category import | Categories page → **Import** | CSV upload, validated in the browser and again on the server |

## Stats export

**Flow** (`exportStatsAction` in
`src/lib/server-actions/stats.server-action.ts`):

1. `requireUser()`; the filter (`month` / `year` / `custom`) is validated and
   turned into a date range by `resolveStatsExportRange`, which uses the same
   range rules as the stats views. That way the file holds exactly what's on
   screen.
2. Cheap checks run before responding, so the UI can show real errors:
   - the user's email is loaded from the DB, never from the client
   - an indexed `countDocuments` for the range: 0 → error, over
     `STATS_EXPORT_MAX_ROWS` → error
3. The rate limit is consumed, and the response returns straight away.
4. `after()` fetches the rows (capped with `.limit()`), builds the CSV and
   emails it to the user with a summary.
   - Failures are logged, never shown to the user.
   - On Vercel, `after()` runs via `waitUntil` once the response is sent.

**CSV columns:** `Date, Type, Category, Amount, Note`, one row per transaction,
oldest first. File names:

- `expenso-2026-11.csv` (month)
- `expenso-2026.csv` (year)
- `expenso-2026-10-15_to_2026-11-27.csv` (custom range)

The **Export CSV** button is disabled while the view is loading or has no
transactions. The server still re-checks.

## Category import / export

**Format** (shared by template, export and import, in
`src/lib/category-csv.util.ts`):

| Column  | Rules                                                            |
| ------- | ---------------------------------------------------------------- |
| `Name`  | Required, ≤ 50 chars, stored lowercase and trimmed               |
| `Type`  | Required, `income` / `expense` / `investment` (case-insensitive) |
| `Color` | Optional; `#RGB` or `#RRGGBB`, stored as uppercase `#RRGGBB`     |

**Validation** (`parseCategoryCsv`) runs in the browser for instant feedback,
then again on the server: a server action is a public endpoint and can be called
with anything. It rejects:

- columns: missing, extra (including a blank trailing column) or repeated; any
  order and case is accepted
- rows: a different number of values than the header
- values: bad names, types or colours
- duplicate name + type within the file
- size: more than 500 rows or 512 KB
- an empty file, or a header with no rows

Errors are capped at 15, plus "…and N more".

**Import** (`importCategoriesAction` → `CategoryService.importMany`):

- Categories are matched by name + type, and the whole file is written in one
  `bulkWrite`:
  - **no match** → created, with the default `Wallet` icon and the colour from
    the file (or one from the palette)
  - **deleted match** → restored
  - **active match with a different colour** → updated
  - **anything else** → unchanged
- The response reports `{ created, updated, restored, unchanged }`.
- The icon is never changed by an import.

**Export** (`exportCategoriesAction`): all active categories, sorted by type
then name. The result is returned to the client, which downloads it via
`downloadCsv` (`src/lib/download.util.ts`). An export can be re-imported
unchanged.

## Security & scalability

| Protection             | Detail                                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth                   | Every action starts with `requireUser()`; all queries are scoped to that user id                                                              |
| Email recipient        | Always the account's email from the DB                                                                                                        |
| Server-side validation | Import is re-validated with the same parser; non-string input is rejected                                                                     |
| Formula injection      | Cells starting with `= + - @` (or tab/CR) are prefixed with `'` on export (`csvCell`), and the prefix is removed on import (`unguardCsvCell`) |
| HTML injection         | User names in emails go through `escapeHtml`                                                                                                  |
| Error leakage          | Only our own messages (validation, rate limit, auth) reach the client; anything else is logged and replaced with a generic message            |
| Rate limits            | See below; enforced in MongoDB, so they hold across serverless instances                                                                      |
| Concurrency            | One category import per user at a time (lock), so racing imports can't create duplicates                                                      |
| Bounded work           | Stats export ≤ 20,000 rows; import ≤ 500 rows / 512 KB; ≤ 1,000 categories per user; category export ≤ 5,000 rows                             |
| Indexes                | Stats export uses `{ userId, date }`; import lookups use `userId` + `name`                                                                    |

### Limits

All limits are in `src/backend/modules/rate-limit/limits.constant.ts`:

| Limit                                                      | Value                      |
| ---------------------------------------------------------- | -------------------------- |
| Stats export emails                                        | 5 per user per hour        |
| Category imports                                           | 10 per user per 10 minutes |
| Category exports                                           | 20 per user per 10 minutes |
| Rows per stats export                                      | 20,000                     |
| Categories per user, active + deleted (enforced on import) | 1,000                      |
| Categories per export                                      | 5,000                      |

Windows are fixed (e.g. 10:00–10:10), so a burst at a window boundary can
briefly allow up to twice the limit. That's acceptable for abuse protection.

### Rate limiter

`src/backend/modules/rate-limit/rate-limit.service.ts`:

- **`enforceRateLimit`** does an atomic `findOneAndUpdate` with `$inc` and
  `upsert` on `key = action:subject:windowIndex`. It throws `RateLimitError` (a
  message safe to show) once the count exceeds the limit.
- **`withLock(key, ttl, busyMessage, task)`** inserts `lock:key`. The unique
  index makes a second insert fail, so that caller gets `busyMessage`. The lock
  is deleted when the task ends and expires on its own after `ttl` if the
  instance dies.
- Both call `RateLimitEntity.init()` first, so the unique index exists before
  anything relies on it.
- Rows live in the **`ratelimits`** collection:
  - unique index on `key`
  - TTL index on `expiresAt`, so MongoDB deletes expired rows by itself (its
    monitor runs about every 60s)
  - no cleanup job is needed

## Files

```
src/lib/csv.util.ts                       parse / quote / build CSV (RFC 4180, BOM, formula guard)
src/lib/category-csv.util.ts              category template, export builder, validator
src/lib/download.util.ts                  browser download helper
src/lib/server-actions/stats.server-action.ts      exportStatsAction
src/lib/server-actions/category.server-action.ts   importCategoriesAction, exportCategoriesAction
src/backend/modules/stats/stats-export.util.ts     filter → date range, stats CSV, summary
src/backend/modules/category/category.service.ts   importMany, findAllForExport
src/backend/modules/transaction/transaction.service.ts  countInRange, findForExport
src/backend/modules/rate-limit/                    limiter, lock, limits
src/app/constants/email-templates/stats-export.email-template.ts
src/components/feature/category/CategoryImport.dialog.tsx
```

## Testing notes

- Pure logic (`parseCategoryCsv`, `buildCategoriesCsv`,
  `resolveStatsExportRange`) has no DB dependency and can be exercised with
  `tsx`.
- To test limits without waiting for a window to pass, delete that user's rows
  from `ratelimits`. Their keys contain the user id.
