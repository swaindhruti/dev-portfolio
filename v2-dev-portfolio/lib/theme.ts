export const THEME_KEY = "dn-theme";

/** Runs in <head> before first paint so the saved theme never flashes. */
export const themeScript = `(function(){try{if(localStorage.getItem("${THEME_KEY}")==="light")document.documentElement.setAttribute("data-theme","light")}catch(e){}})()`;
