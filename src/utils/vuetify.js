import { vuetify } from "../main";

export function toggleTheme() {
  vuetify.framework.theme.dark = !vuetify.framework.theme.dark;
  localStorage.setItem("dark", vuetify.framework.theme.dark);
}