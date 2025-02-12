// mi-preset.ts
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
const MyPreset = definePreset(Aura, {
  semantic: {
      primary: {
          50: '{blue.100}',
          100: '{blue.200}',
          200: '{blue.300}',
          300: '{blue.450}',
          400: '{blue.500}',
          500: '{blue.950}',
          600: '{blue.800}',
          700: '{blue.950}',
          800: '{blue.950}',
          900: '{blue.950}',
          950: '{blue.950}'
      }
  }
});

export default MyPreset;