export const THEME_STORAGE_KEY = "claims-workbench:theme";
export const THEME_EVENT = "claims-workbench:theme-change";

/** Runs in <head> before paint: saved theme, else the OS preference. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
