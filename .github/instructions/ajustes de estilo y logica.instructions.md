Aquí tienes tu requerimiento convertido a un **.md claro, técnico y directo (tipo bug report para desarrollador)** para que lo entiendan sin confusión:

```md id="uxbugfix001"
# 🛠️ Correcciones UI/UX del Proyecto

## 📌 Problema general
La interfaz actual presenta problemas de espaciado, jerarquía visual, uso incorrecto de animaciones y estilos inconsistentes en varios componentes del sistema.

---

## 📌 1. Header pegado al borde superior

### 🔴 Problema
El encabezado está completamente pegado al borde superior de la pantalla, sin respetar el área segura (safe area).

### 🎯 Comportamiento esperado
```

| borde superior seguro |
|     HEADER           |
| pequeño espacio      |
| contenido            |

```

### ❗ Impacto
- Mala experiencia visual
- Se ve desalineado en dispositivos con notch

---

## 📌 2. Lottie animations no se están usando

### 🔴 Problema
Las animaciones Lottie existentes en `assets` no se están utilizando correctamente.

### 🎯 Comportamiento esperado
- Mostrar animación Lottie en:
  - carga de pantalla (loading)
  - producto creado
  - producto actualizado
  - estados de éxito

### ❗ Impacto
- UI sin feedback visual moderno
- experiencia de usuario incompleta

---

## 📌 3. Botón de cerrar sesión y contraseña mal ubicado

### 🔴 Problema
Los botones están dentro del contenedor principal.

### 🎯 Comportamiento esperado

```

| borde superior |
| BOTONES (logout / password) |
| pequeño espacio |
| CONTENIDO PRINCIPAL |

```

### ❗ Requerimiento
- Deben estar fuera del contenedor principal
- Posicionados en zona superior derecha o barra superior

---

## 📌 4. Espaciado incorrecto en lista de productos

### 🔴 Problema
La lista de productos está pegada al borde superior.

### 🎯 Comportamiento esperado

```

| pequeño espacio |
| TÍTULO         |
| pequeño espacio |
| LISTA PRODUCTOS |

```

---

## 📌 5. Estilo de texto incorrecto en tarjetas de productos

### 🔴 Problema
El texto dentro de las tarjetas aparece en color blanco.

### 🎯 Comportamiento esperado
- Color del texto: **morado**
- Mejor contraste y consistencia visual

---

## 📌 6. Estructura incorrecta de tarjetas de productos

### 🔴 Problema
Las tarjetas muestran demasiada información desde el inicio.

### 🎯 Comportamiento esperado

### 🔹 Vista inicial (card):
- Imagen del producto
- Precio

### 🔹 Vista al seleccionar producto:
- Información completa:
  - nombre
  - descripción
  - precio
  - detalles adicionales

---

## 📌 7. Jerarquía visual general incorrecta

### 🔴 Problema
No existe separación clara entre:
- header
- botones
- contenido
- listas

### 🎯 Estructura esperada global

```

| SAFE AREA |
| HEADER |
| botones (logout / password) |
| espacio pequeño |
| título sección |
| lista de productos |
| contenido |

```

---

## 📌 8. Reglas UI obligatorias

- Usar SafeAreaView en todas las pantallas principales
- Usar Lottie en estados de carga y éxito
- Evitar elementos pegados al borde
- Mantener consistencia de color (morado para textos de cards)
- Separación visual clara entre secciones

---

## 🚀 Resultado esperado

- UI profesional
- Mejor jerarquía visual
- Animaciones activas (Lottie)
- Espaciado correcto en toda la app
- Mejor experiencia de usuario
```

