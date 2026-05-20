import { createTamagui } from 'tamagui';
import { config as defaultConfig } from '@tamagui/config/v3';
import { PASTEL } from './constants/colors';

export const config = createTamagui({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    color: {
      ...defaultConfig.tokens.color,
      pastelBlue1: PASTEL.blue1,
      pastelBlue2: PASTEL.blue2,
      pastelPurple1: PASTEL.purple1,
      pastelPink1: PASTEL.pink1,
      pastelText: PASTEL.text,
    },
  },
  themes: {
    ...defaultConfig.themes,
    pastel: {
      background: PASTEL.blue3,
      color: PASTEL.text,
      borderColor: PASTEL.purple2,
    },
  },
});

export type AppConfig = typeof config;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
