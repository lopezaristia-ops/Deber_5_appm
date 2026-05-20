# 🔧 Guía de Implementación - Refactorización de Arquitectura

**Boutique Aurora - React Native + Expo + Supabase**

---

## 📋 Tabla de Contenidos

1. [Fase 1: Reorganización Crítica](#fase-1-reorganización-crítica)
2. [Fase 2: Cambios de Imports](#fase-2-cambios-de-imports)
3. [Fase 3: Verificación](#fase-3-verificación)

---

## ⏱️ Estimado de Tiempo

- **Fase 1 (Reorganización):** 15-20 minutos
- **Fase 2 (Imports):** 20-30 minutos
- **Fase 3 (Verificación):** 10-15 minutos
- **Total:** ~1 hora

---

## FASE 1: Reorganización Crítica

### Paso 1.1: Mover `constants/` → `src/core/constants/`

```bash
# Crear nuevas carpetas
mkdir -p examen_2/src/core/constants

# Mover archivos
mv examen_2/constants/colors.ts examen_2/src/core/constants/
mv examen_2/constants/theme.ts examen_2/src/core/constants/

# Eliminar carpeta antigua (cuando esté vacía)
rm -rf examen_2/constants/
```

**Archivos movidos:**
```
❌ examen_2/constants/colors.ts
❌ examen_2/constants/theme.ts

✅ examen_2/src/core/constants/colors.ts
✅ examen_2/src/core/constants/theme.ts
```

---

### Paso 1.2: Mover `hooks/` → `src/shared/hooks/`

```bash
# Crear nueva carpeta
mkdir -p examen_2/src/shared/hooks

# Mover archivos
mv examen_2/hooks/use-color-scheme.ts examen_2/src/shared/hooks/
mv examen_2/hooks/use-color-scheme.web.ts examen_2/src/shared/hooks/
mv examen_2/hooks/use-theme-color.ts examen_2/src/shared/hooks/

# Eliminar carpeta antigua
rm -rf examen_2/hooks/
```

**Archivos movidos:**
```
❌ examen_2/hooks/use-color-scheme.ts
❌ examen_2/hooks/use-color-scheme.web.ts
❌ examen_2/hooks/use-theme-color.ts

✅ examen_2/src/shared/hooks/use-color-scheme.ts
✅ examen_2/src/shared/hooks/use-color-scheme.web.ts
✅ examen_2/src/shared/hooks/use-theme-color.ts
```

---

### Paso 1.3: Centralizar Componentes UI

```bash
# Mover componentes genéricos a src/shared/ui/
mv examen_2/components/ProductCard.tsx examen_2/src/shared/ui/
mv examen_2/components/GradientBackground.tsx examen_2/src/shared/ui/
mv examen_2/components/LoadingLottie.tsx examen_2/src/shared/ui/
mv examen_2/components/external-link.tsx examen_2/src/shared/ui/
mv examen_2/components/haptic-tab.tsx examen_2/src/shared/ui/
mv examen_2/components/hello-wave.tsx examen_2/src/shared/ui/
mv examen_2/components/parallax-scroll-view.tsx examen_2/src/shared/ui/
mv examen_2/components/themed-text.tsx examen_2/src/shared/ui/
mv examen_2/components/themed-view.tsx examen_2/src/shared/ui/

# ELIMINAR componentes duplicados
rm examen_2/components/PastelButton.tsx
rm examen_2/components/PastelInput.tsx

# Actualizar componentes que quedan
mv examen_2/components/ui/ examen_2/src/shared/ui/ui-elements/

# Eliminar carpeta components si está vacía
rm -rf examen_2/components/
```

**Estructura final:**
```
✅ examen_2/src/shared/ui/
   ├── Button.tsx
   ├── Input.tsx
   ├── ProductCard.tsx
   ├── GradientBackground.tsx
   ├── LoadingLottie.tsx
   └── ui-elements/
       ├── collapsible.tsx
       ├── icon-symbol.tsx
       └── icon-symbol.ios.tsx
```

---

### Paso 1.4: Reorganizar Carpeta `register/`

```bash
# Crear estructura de carpetas para auth
mkdir -p examen_2/src/pages/\(auth\)/register
mkdir -p examen_2/src/pages/\(auth\)/forgot-password
mkdir -p examen_2/src/pages/\(auth\)/reset-password

# Mover register
mv examen_2/src/register/ui/RegisterPage.tsx examen_2/src/pages/\(auth\)/register/ui/
rm -rf examen_2/src/register/

# Crear archivo índice para rutas auth
mkdir -p examen_2/src/pages/\(auth\)/_layout.tsx
```

**Estructura de carpetas:**
```
❌ examen_2/src/register/ui/RegisterPage.tsx

✅ examen_2/src/pages/(auth)/
   ├── login/ui/LoginPage.tsx
   ├── register/ui/RegisterPage.tsx
   ├── forgot-password/ui/ForgotPasswordPage.tsx
   └── reset-password/ui/ResetPasswordPage.tsx
```

---

### Paso 1.5: Crear `_layout.tsx` para Auth Routes

```bash
# Crear archivo
touch examen_2/src/pages/\(auth\)/_layout.tsx
```

**Contenido del archivo:**
```typescript
// examen_2/src/pages/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
```

---

### Paso 1.6: Reorganizar app/pages al nivel de `app/`

```bash
# Las páginas NO auth deben estar en app/
# Ya están correctas en app/:
# - app/home.tsx
# - app/products.tsx
# - app/product-form.tsx
# - app/change-password.tsx

# Pero como ahora tenemos (auth), verificar que estén correctas
# Los siguientes archivos DEBEN estar en app/ (no en app/(auth))
# - app/confirm-email.tsx
# - app/reset-password.tsx
# - app/forgot-password.tsx

# Revisar que app/_layout.tsx solo tenga Stack.Screen para (auth)
```

---

## FASE 2: Cambios de Imports

### PASO 2.1: Actualizar imports de `constants`

**Buscar todos los:**
```typescript
❌ from "../../../../constants/colors";
❌ from "../../../../constants/theme";
❌ from "../../../constants/colors";
❌ from "../../constants/colors";
```

**Reemplazar por:**
```typescript
✅ from "@/core/constants/colors";
✅ from "@/core/constants/theme";
```

**Archivos a actualizar:**
```
- examen_2/app/_layout.tsx
- examen_2/app/home.tsx
- examen_2/app/product-form.tsx
- examen_2/app/products.tsx
- examen_2/app/(auth)/login.tsx
- examen_2/app/(auth)/register.tsx
- examen_2/src/pages/home/ui/HomePage.tsx
- examen_2/src/pages/login/ui/LoginPage.tsx
- examen_2/src/pages/confirm-email/ui/ConfirmEmailPage.tsx
- examen_2/src/pages/forgot-password/ui/ForgotPasswordPage.tsx
- examen_2/src/pages/reset-password/ui/ResetPasswordPage.tsx
- examen_2/src/pages/register/ui/RegisterPage.tsx
- examen_2/src/shared/ui/Button.tsx
- examen_2/src/shared/ui/Input.tsx
- examen_2/src/shared/ui/ProductCard.tsx
- examen_2/components/GradientBackground.tsx
- examen_2/components/*.tsx (todos los que importan)
```

---

### PASO 2.2: Actualizar imports de `hooks`

**Buscar:**
```typescript
❌ from "../../../../hooks/use-color-scheme";
❌ from "../../../../hooks/use-theme-color";
❌ from "../../../hooks/use-color-scheme";
```

**Reemplazar por:**
```typescript
✅ from "@/shared/hooks/use-color-scheme";
✅ from "@/shared/hooks/use-theme-color";
```

**Archivos a actualizar:**
```
- examen_2/app/_layout.tsx
- Cualquier componente que use hooks
```

---

### PASO 2.3: Actualizar imports de componentes movidos

**Buscar:**
```typescript
❌ from "../../../../components/ProductCard";
❌ from "../../../../components/GradientBackground";
❌ import { PastelButton } from "../../../../components/PastelButton";
❌ import { PastelInput } from "../../../../components/PastelInput";
```

**Reemplazar por:**
```typescript
✅ from "@/shared/ui/ProductCard";
✅ from "@/shared/ui/GradientBackground";
✅ from "@/shared/ui/Button";
✅ from "@/shared/ui/Input";
```

**Archivos a actualizar:**
```
- examen_2/src/pages/home/ui/HomePage.tsx
- examen_2/src/pages/products/ui/ProductsPage.tsx
- examen_2/app/home.tsx
- examen_2/app/products.tsx
- examen_2/app/(auth)/login.tsx
- Todos los que usen componentes Pastel
```

---

### PASO 2.4: Ejemplo de Cambios Completos

#### Archivo: `examen_2/src/pages/home/ui/HomePage.tsx`

**ANTES:**
```typescript
import { PASTEL } from "../../../../constants/colors";
import { ProductCard } from "../../../../components/ProductCard";
import { useColorScheme } from "../../../../hooks/use-color-scheme";

export const HomePage = () => {
  const theme = useColorScheme();
  // ...
};
```

**DESPUÉS:**
```typescript
import { PASTEL } from "@/core/constants/colors";
import { ProductCard } from "@/shared/ui/ProductCard";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";

export const HomePage = () => {
  const theme = useColorScheme();
  // ...
};
```

---

#### Archivo: `examen_2/src/shared/ui/Button.tsx`

**ANTES:**
```typescript
import { PASTEL } from "../../../constants/colors";

export const Button = ({ /* ... */ }) => {
  // ...
};
```

**DESPUÉS:**
```typescript
import { PASTEL } from "@/core/constants/colors";

export const Button = ({ /* ... */ }) => {
  // ...
};
```

---

#### Archivo: `examen_2/src/pages/login/ui/LoginPage.tsx`

**ANTES:**
```typescript
import { PASTEL } from "../../../../constants/colors";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export const LoginPage = () => {
  // ...
};
```

**DESPUÉS:**
```typescript
import { PASTEL } from "@/core/constants/colors";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export const LoginPage = () => {
  // ...
};
```

---

### PASO 2.5: Actualizar `tsconfig.json` (si es necesario)

Verificar que los path mappings sean correctos:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/core/*": ["src/core/*"],
      "@/entities/*": ["src/entities/*"],
      "@/features/*": ["src/features/*"],
      "@/pages/*": ["src/pages/*"],
      "@/shared/*": ["src/shared/*"]
    }
  }
}
```

---

## FASE 3: Verificación

### Checklist de Verificación

- [ ] ¿Existen `/constants` y `/hooks` en la raíz? (Deben estar eliminados)
- [ ] ¿Está `src/core/constants/` con los archivos?
- [ ] ¿Está `src/shared/hooks/` con los archivos?
- [ ] ¿Está `src/shared/ui/` con todos los componentes reutilizables?
- [ ] ¿Se eliminaron `PastelButton.tsx` y `PastelInput.tsx`?
- [ ] ¿Se movió `register/` a `src/pages/(auth)/register/`?
- [ ] ¿Se actualizaron TODOS los imports en el proyecto?
- [ ] ¿El proyecto compila sin errores?
- [ ] ¿Todos los path `@/` funcionan correctamente?

### Verificación de Compilación

```bash
cd examen_2/

# Revisar errores de TypeScript
npx tsc --noEmit

# Revisar errores de ESLint
npm run lint

# Si hay problemas de imports no resueltos:
# 1. Verificar que el archivo existe en la nueva ubicación
# 2. Verificar que el import usa el path correcto (@/...)
# 3. Verificar que tsconfig.json tiene los paths configurados
```

---

### Búsqueda y Reemplazo Masivo

Si prefieres hacer todos los cambios de imports de una sola vez:

**En VS Code:**
1. Presionar `Ctrl + H` (o `Cmd + H` en Mac)
2. Habilitar "Regex" (botón con `.*`)
3. Reemplazar todas las instancias:

```regex
# Reemplazar: from "../../../../constants/
# Por: from "@/core/constants/

# Reemplazar: from "../../../../hooks/
# Por: from "@/shared/hooks/

# Reemplazar: from "../../../../components/Product
# Por: from "@/shared/ui/Product

# Reemplazar: from "../../../../components/Gradient
# Por: from "@/shared/ui/Gradient

# Reemplazar: PastelButton
# Por: Button

# Reemplazar: PastelInput
# Por: Input
```

---

## 🚀 Próximos Pasos (Post-Refactorización)

Después de completar esta reorganización, proceder con:

1. **FASE 2: Estructura de Features**
   - Reorganizar features con `ui/` folders
   - Crear `features/products/` completa
   - Normalizar servicios API

2. **FASE 3: Optimización**
   - Tipos compartidos
   - Error handling centralizado
   - Logging y telemetría

---

## ⚠️ Cosas Importantes

- **Siempre hacer un backup o commit** antes de hacer cambios masivos
- **Verificar que cada cambio compila** antes de pasar al siguiente
- **No cambiar nombres de archivos**, solo reorganizar carpetas
- **Los imports con `@/` deben usar rutas relativas a `src/`**
- **Todos los componentes reutilizables van en `src/shared/ui/`**

---

## ❓ Troubleshooting

### Problema: "Cannot find module '@/core/constants/colors'"

**Solución:**
1. Verificar que el archivo existe: `src/core/constants/colors.ts`
2. Verificar que `tsconfig.json` tiene: `"@/*": ["src/*"]`
3. Reiniciar el servidor de desarrollo

### Problema: Componentes no se ven después de mover

**Solución:**
1. Limpiar caché: `rm -rf .expo`
2. Limpiar node_modules: `rm -rf node_modules && npm install`
3. Reiniciar: `npm start --clear`

### Problema: Import cicular

**Solución:**
- Verificar que `shared/` NO importa de `features/`
- Verificar que `features/` NO importa de `pages/`
- Solo se permite importar hacia "abajo" en la arquitectura

---

## 📞 Soporte

Si encuentras problemas durante la migración:
1. Verificar que seguiste cada paso en orden
2. Revisar los archivos movidos están en el lugar correcto
3. Revisar que todos los imports usan `@/`
4. Hacer un `npm start` con `--clear` flag
