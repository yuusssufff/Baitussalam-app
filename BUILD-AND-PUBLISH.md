# Baitussalam Prayer Times — Build & Publish Guide

This bundle is a **complete, working app**. The whole app lives in `www/index.html`
(one file: UI + prayer-time logic + Mawaqit sync + notifications). Everything else
wraps it into a native Android APK you can hand out for free.

You do **one build step once** to turn this into an `.apk`. Below are three ways to
do it, easiest first. Pick one.

---

## What it already does

- Pulls the **real daily adhan + iqamah times** from your Mawaqit page and caches the
  **whole year** on the phone, so it works offline after the first open.
- Countdown to the next prayer, Today + full-month timetable, Friday Jumu'ah handling.
- **Reminders**: master mute, per-prayer mute, and a lead time per prayer (On time / 5 / 10 / 15 min).
- Silent-mode nudge, settings (24-hour clock, show Shurooq, adhan sound), Mosque info,
  donation details with copy button.
- All preferences persist. Reminders reschedule on every change and every time the app opens.

The design matches the Claude Design handoff exactly (same colours, type, spacing).

---

## Try it in 30 seconds (no build)

Open `www/index.html` in any browser (double-click it). You'll see the full app.
On a phone browser you can even **Add to Home Screen** and it behaves like an app —
this is the free "web build" for iPhone users. (Reliable background alerts need the
Android build below; a browser can only notify while it's open.)

> Note: opening the file directly from your computer, the browser may block the live
> Mawaqit fetch (CORS) and show "Estimated times". That's expected locally — once it's
> hosted online, or built as the Android app, it pulls the real times automatically.

---

## Option A — Build the free APK with Android Studio (recommended)

This gives you real, reliable prayer notifications that fire even when the app is closed.
Everything here is free.

**Install once**
1. [Node.js](https://nodejs.org) (LTS).
2. [Android Studio](https://developer.android.com/studio) (includes the Android SDK).

**Build**
Open a terminal in this folder and run:

```bash
npm install
npx cap add android
npx cap sync
npx cap open android
```

Android Studio opens the project. Then in Android Studio:

- Top menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
- When it finishes, click **locate** in the popup. Your file is:
  `android/app/build/outputs/apk/debug/app-debug.apk`

That `.apk` is your app. Copy it anywhere and install it.

**Whenever you change `www/index.html`**, run `npx cap sync` again, then rebuild.

---

## Option B — Build the APK in the cloud, no Android Studio (GitHub Actions)

If you don't want to install Android Studio, push this folder to a free GitHub repo
and let GitHub build the APK for you.

1. Create a free GitHub account and a new empty repository.
2. Upload this whole folder to it.
3. Add the file `.github/workflows/android.yml` (already included in this bundle).
4. Go to the repo's **Actions** tab → run the workflow → download the built APK from
   the run's **Artifacts** when it finishes (a few minutes).

Free for public repos and within the generous free minutes for private ones.

---

## Option C — Easiest, but weaker notifications (PWABuilder)

1. Host `www/` on any free static host — [Netlify Drop](https://app.netlify.com/drop),
   Cloudflare Pages, or GitHub Pages. You get a URL like `https://your-masjid.netlify.app`.
2. Go to [pwabuilder.com](https://www.pwabuilder.com), paste that URL, and click
   **Package for Android → Download**. You get a signed APK.

This is the least effort. The trade-off: PWA-based Android packages have **weaker
background notification support** than Option A. The times, countdown and timetable
work perfectly; scheduled reminders are less reliable. For a prayer-reminder app,
**Option A is the better choice** — but Option C is fine if you mainly want the timetable.

---

## Distributing the APK (no Play Store, free)

- Put the `.apk` on the masjid website (or Google Drive / WhatsApp) and share the link.
- On first install, Android shows a one-time **"install unknown apps"** prompt — the
  user allows it for their browser/files app, then installs. This is normal for
  side-loaded apps and costs nothing.
- No Google Play account, no fee.

> If you later want it on the Play Store, that's a one-time $25 Google account.
> The same project builds a release AAB (`Build → Generate Signed Bundle`). Optional.

---

## Before you release — quick customisations

Open `www/index.html` and find the `MOSQUE = { … }` block near the top. Confirm/replace:

- **`phone` and `email`** — the prototype values are placeholders. Get the real ones.
- **`bank`, `facilities`, `madrasah`** — confirm with the committee.

Assets:
- **App icon / logo** — `www/icons/` has placeholder mosque icons. Replace
  `icon-192.png`, `icon-512.png`, `icon-1024.png` with the real masjid logo (same sizes).
  After Option A, regenerate Android icons with Android Studio's **Image Asset** tool
  (right-click `res` → New → Image Asset), or just replace the `mipmap` PNGs.
- **Adhan sound (optional)** — to play a real adhan on notifications, add a short
  `adhan.wav` file to `android/app/src/main/res/raw/adhan.wav` after Option A.
  Clear the recording with the committee first. Without it, the phone's default
  notification sound is used — everything still works.

---

## About the prayer times (important)

The app reads your mosque's public Mawaqit page and extracts the full-year timetable
embedded in it, then caches it. This needs no server and no API key, and it updates
itself when the app is opened online.

**The durable, officially-supported route** is a Mawaqit API key. Mawaqit help mosques
who ask — whoever administers your Mawaqit account can request API access for Erdington
Islamic Foundation via the Mawaqit help centre. If you get a key, it's more robust than
reading the page. The app works today without it; the key is a nice upgrade later.

Times are treated as Europe/London and reschedule on DST changes and every app open,
so Fajr never fires an hour off.

---

## File map

```
baitussalam/
├─ www/                     ← the entire app (this is what runs)
│  ├─ index.html            ← UI + logic + Mawaqit sync + notifications
│  ├─ manifest.webmanifest  ← makes it installable as a PWA
│  ├─ sw.js                 ← offline cache (web build only)
│  └─ icons/                ← app icons (replace with real logo)
├─ capacitor.config.json    ← native app id, name, notification settings
├─ package.json             ← Capacitor dependencies
├─ .github/workflows/       ← optional cloud APK build (Option B)
└─ BUILD-AND-PUBLISH.md     ← this file
```

App id is `org.erdingtonislamicfoundation.baitussalam` — change it in
`capacitor.config.json` before the first build if you prefer a different one
(you can't change it after publishing to the Play Store, but for side-loaded APKs
it doesn't matter).
