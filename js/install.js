// Add to Home Screen: Android hands us a prompt; iPhone needs the Share sheet.
import { t } from "./i18n.js";
import { sheet, label, ICON } from "./ui.js";

let deferred = null;
addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; });
const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone;
const ios = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
export const canInstall = () => !standalone() && (deferred || ios() || true);
export async function install() {
  if (deferred) { deferred.prompt(); await deferred.userChoice; deferred = null; return; }
  sheet(`<div class="confirm">${label(t("Install"))}<h2 class="h-mid">${t("ENSO on your Home Screen.")}</h2>
    <ol class="howto"><li>${t("Tap Share in Safari's bar")}</li><li>${t("Choose “Add to Home Screen”")}</li><li>${t("Open ENSO like any app — it works offline too")}</li></ol>
    <button class="btn btn-ink full" type="button" data-x>${t("Got it")}</button></div>`);
}
