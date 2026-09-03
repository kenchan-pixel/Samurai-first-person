# Closed Beta v0.5 Release-Prep Baseline

Status: **approved product direction; bounded implementation baseline for `autonomous-evolution`**.

Ken's next release goal is a limited external Closed Beta after the current combat/playability issues are repaired. The beta should make repeat play measurable and make it easy for testers to share results, feedback and bugs. This document records what autonomous evolution may implement now and what still requires a separate privacy/data Decision Gate.

## Allowed before a remote-data Decision Gate

- Keep the current mobile playable campaign, direct practice, challenge and 今日陣 baseline intact.
- Local/session-only personal records, practice comparison and post-run coaching using existing authoritative combat events.
- Explicit player-triggered result sharing through Web Share or clipboard.
- Explicit player-triggered **體驗意見 / 錯誤回報** export through Web Share or clipboard. The export may include only already-visible result context, a clean game URL and text the player deliberately types.
- Release-readiness copy/checklists and mobile result/report UI needed for a small Closed Beta.
- All of the above must remain usable without account creation and without background upload.

## Still gated — do not implement autonomously yet

A separate owner-approved privacy/data Decision Gate is required before adding any of the following:

- server-stored player ID, nickname, login or account;
- cloud personal record or cross-device sync;
- multiplayer/global leaderboard;
- remote feedback/bug ingestion endpoint or admin inbox;
- gameplay telemetry, analytics, device fingerprinting, advertising or external tracking;
- any new backend/database schema that stores tester data.

The Decision Gate must define data fields, retention/deletion, abuse/spam controls, public/private visibility, moderation, identifiers, privacy notice/consent and hosting/cost ownership before the first remote write is added.

## Closed Beta feedback contract

- The game must state clearly that it does **not** automatically upload the report.
- A report is created only after an explicit player action.
- A report may contain: report type, current visible result/mode/progress/score/summary, the player's typed note, and a query/hash-free game URL.
- Do not include user agent, IP address, cookies, local-storage identifiers, hidden device data, account identifiers or background telemetry.
- Native share cancellation is a clean no-op; unsupported share may fall back to local clipboard copy.
- Result/report controls must remain ≥44 px and fit the 320×568 acceptance viewport without obscuring the terminal result flow.

## Closed Beta release-readiness UI contract

- The start surface may expose one compact **封測資訊** control that opens a bounded tester guide without changing the playable mode selector or combat HUD.
- The guide should make the intended test loop explicit: play at least one duel, repeat the same practice opponent once to inspect **修行進度**, then use the existing explicit **回報** path when something is unclear or broken.
- The guide must state that the current Preview is a Closed Beta preparation build, requires no account, performs no automatic report upload, and has no cloud leaderboard or background telemetry.
- This release-prep guide is informational only: it must not create a storage key, tester/player identifier, analytics event, network request or gameplay rule.
- The guide may show a **本機戰績** summary by read-only reuse of the existing campaign mastery best and challenge best records. It may derive a simple next-play suggestion from those already-stored values, but it must not create or update any storage key, add a hidden identifier, or imply cloud/global ranking.
- The local-record summary must label itself as **只讀 · 不上傳**, tolerate missing/malformed/storage-disabled data, and remain inside the same scrollable 320×568 guide panel without adding another start-screen touch target.
- The control and panel must remain inside the 320×568 acceptance viewport, preserve ≥44 px touch ownership for the control/close action, and disappear with the start modal once play begins.

## Release boundary

`autonomous-evolution` may continue building local/export-only Closed Beta readiness under this baseline. It must stop at the first remote-data write or public leaderboard/account design and open the privacy/data Decision Gate instead. Draft PR #1 remains unmerged until Ken explicitly decides to merge/release.
