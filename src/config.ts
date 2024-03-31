import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: 'Dai0v0',
  subtitle: '没有目的地，向前走',
  lang: 'en',
  themeHue: 260,
  banner: {
    enable: true,
    src: 'assets/images/banner.jpg'
  },
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    {
      name: 'GitHub',
      url: 'https://github.com/u1805',
      external: false,
    },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/avatar.jpg',
  name: 'Dai0v0',
  bio: '一瞬一瞬で一生',
  links: [
    {
      name: 'Mail',
      icon: 'material-symbols:mail',
      url: 'mailto:dai@outlook.in',
    },
    {
      name: 'GitHub',
      icon: 'fa6-brands:github',
      url: 'https://github.com/u1805',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
