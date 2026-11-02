# QQ Exam PWA

This is a browser-based recreation of the supplied SwiftUI exam interface.

## Install on iPad
1. Host the contents of this folder on an HTTPS static host (for example, a private GitHub repository with GitHub Pages enabled, or another HTTPS host).
2. On the iPad, open the hosted URL in Safari.
3. Tap Share -> Add to Home Screen.
4. Enable "Open as Web App" if the option is shown, then tap Add.

The service worker enables caching/offline loading after the first successful visit. The first visit requires an internet connection.

## Important implementation notes
- This is a PWA, not a native iOS `.ipa`.
- A PWA cannot lock iPadOS, prevent app switching, or provide true supervised assessment/kiosk mode.
- The source SwiftUI code defines `correctPassword = "1234"` but never checks it in `verifyPassword()`. This recreation preserves that behavior: any entered value proceeds.
- The source contains one question and four answer options, while the navigation has 60 slots. This recreation preserves that same question across all 60 slots.
- The source timer is 90 minutes (`90 * 60`) while some labels show 150 minutes / 02:30:00. The actual countdown follows the 90-minute code value.
- The "upload" is a local visual simulation; no data is sent to a server.
- The calculator code displays the entered password (or `ggy`) as in the source. Do not use a real or sensitive password here.
