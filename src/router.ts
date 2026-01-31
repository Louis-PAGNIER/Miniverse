import Canvas from "@/components/3D/Canvas.vue";
import HomeSheetPage from "@/pages/sheet-pages/HomeSheetPage.vue";
import PlayersSheetPage from "@/pages/sheet-pages/PlayersSheetPage/PlayersSheetPage.vue";
import VersionSheetPage from "@/pages/sheet-pages/VersionSheetPage.vue";
import ModsSheetPage from "@/pages/sheet-pages/ModsSheetPage.vue";
import ConsoleSheetPage from "@/pages/sheet-pages/ConsoleSheetPage.vue";
import ModSheetPage from "@/pages/sheet-pages/ModSheetPage.vue";
import FilesSheetPage from "@/pages/sheet-pages/FilesSheetPage.vue";
import Settings from "@/pages/Settings.vue";
import MainSettingsPage from "@/pages/settings-pages/MainSettingsPage.vue";
import AccountSettingsPage from "@/pages/settings-pages/AccountSettingsPage.vue";
import UsersSettingsPage from "@/pages/settings-pages/UsersSettingsPage.vue";
import StatisticsSettingsPage from "@/pages/settings-pages/StatisticsSettingsPage.vue";
import InformationSettingsPage from "@/pages/settings-pages/InformationSettingsPage.vue";
import ConnectedPlayersSheetPage from "@/pages/sheet-pages/PlayersSheetPage/ConnectedPlayersSheetPage.vue";
import BannedPlayersSheetPage from "@/pages/sheet-pages/PlayersSheetPage/BannedPlayersSheetPage.vue";

export const mainRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Canvas
  },
  {
    path: '/miniverse/:miniverse_id',
    component: Canvas,
    children: [
      {
        path: '',
        name: 'HomeSheetPage',
        component: HomeSheetPage
      },
      {
        path: 'version',
        name: 'VersionSheetPage',
        component: VersionSheetPage
      },
      {
        path: 'players',
        name: 'PlayersSheetPage',
        component: PlayersSheetPage,
        children: [
          {
            path: '',
            redirect: { name: 'ConnectedPlayersSheetPage' }
          },
          {
            path: 'connected',
            name: 'ConnectedPlayersSheetPage',
            component: ConnectedPlayersSheetPage
          },
          {
            path: 'banned',
            name: 'BannedPlayersSheetPage',
            component: BannedPlayersSheetPage
          }
        ]
      },
      {
        path: 'mods',
        name: 'ModsSheetPage',
        component: ModsSheetPage,
        children: [
          {
            path: '',
            redirect: { name: 'InstalledModsSheetPage' }
          },
          {
            path: 'installed',
            name: 'InstalledModsSheetPage', // TODO: Link component
          },
          {
            path: 'search',
            name: 'SearchModsSheetPage', // TODO: Link component
          },
          {
            path: ':modId',
            name: 'ModSheetPage',
            component: ModSheetPage
          }
        ]
      },
      {
        path: 'console',
        name: 'ConsoleSheetPage',
        component: ConsoleSheetPage
      },
      {
        path: 'files',
        name: 'Files',
        component: FilesSheetPage
      }
    ]
  },
  {
    path: '/settings',
    component: Settings,
    children: [
      {
        path: '',
        name: 'SettingsMain',
        component: MainSettingsPage
      },
      {
        path: 'account',
        name: 'SettingsAccount',
        component: AccountSettingsPage
      },
      {
        path: 'users',
        name: 'SettingsUsers',
        component: UsersSettingsPage
      },
      {
        path: 'statistics',
        name: 'SettingsStatistics',
        component: StatisticsSettingsPage
      },
      {
        path: 'information',
        name: 'SettingsInformation',
        component: InformationSettingsPage
      },
    ]
  },
]

export const sheetPagesRoutes = {
  home: { name: "Home", component: HomeSheetPage },
  players: { name: "Players", component: PlayersSheetPage },
  version: { name: "Version", component: VersionSheetPage },
  mods: { name: "Mods", component: ModsSheetPage },
  mod: { name: "Mod", component: ModSheetPage },
  console: { name: "Console", component: ConsoleSheetPage },
  files: { name: "Files", component: FilesSheetPage },
};