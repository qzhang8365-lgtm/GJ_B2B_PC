(function initializeGjFonts() {
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  const isMac = /mac/i.test(platform);
  const isWindows = /win/i.test(platform);

  document.documentElement.dataset.gjOs = isMac
    ? "macos"
    : isWindows
      ? "windows"
      : "other";

  if (document.documentElement.dataset.gjNumeric !== "true") return;

  if (!document.fonts || typeof document.fonts.load !== "function") {
    console.warn("[GJ Design System] Font Loading API unavailable; numeric text will use the configured DIN/system fallback if GJType is unavailable.");
    return;
  }

  Promise.all([
    document.fonts.load('400 16px "GJType"'),
    document.fonts.load('700 16px "GJType"')
  ]).then((results) => {
    const loaded = results.every((faces) => faces.length > 0);
    if (!loaded) {
      console.warn("[GJ Design System] GJType failed to load; numeric text is using the inline DIN/system fallback.");
    }
  }).catch((error) => {
    console.warn("[GJ Design System] GJType failed to load; numeric text is using the inline DIN/system fallback.", error);
  });
})();
