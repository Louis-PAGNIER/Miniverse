import Canvas from "@/components/3D/Canvas.vue";
import HomeSheetPage from "@/pages/sheet-pages/HomeSheetPage.vue";
import PlayersSheetPage from "@/pages/sheet-pages/PlayersSheetPage.vue";
import VersionSheetPage from "@/pages/sheet-pages/VersionSheetPage.vue";
import ModsSheetPage from "@/pages/sheet-pages/ModsSheetPage.vue";
import ConsoleSheetPage from "@/pages/sheet-pages/ConsoleSheetPage.vue";

export const mainRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Canvas
  },
  {
    path: '/miniverse/:catchAll(.*)',
    component: Canvas,
  }
]

export const sheetPagesRoutes = {
  home: { name: "Home", component: HomeSheetPage },
  players: { name: "Players", component: PlayersSheetPage },
  version: { name: "Version", component: VersionSheetPage },
  mods: { name: "Mods", component: ModsSheetPage },
  console: { name: "Console", component: ConsoleSheetPage },
};