# Requerimientos de Desarrollo: Dashboard Principal y Control de Permisos CRUD

## ⚠️ Regla Estricta del Proyecto
* **No modificar, renombrar ni alterar** los archivos existentes que se hacen referencia al "skill". Esos archivos se deben respetar y mantener intactos. Toda la lógica nueva se debe construir alrededor de ellos sin romper sus referencias.

---

## 1. Diseño de la Interfaz: Dashboard Grid
En la pantalla principal, se debe implementar una distribución basada en un sistema de rejilla (**Dashboard Grid**) para mostrar los productos de forma limpia y organizada.

* **Estructura Visual:** Tarjetas (Cards) ordenadas en un Grid adaptativo (Responsive).
* **Elementos por Tarjeta:** 
  * Imagen/Icono del producto.
  * Nombre y descripción.
  * Identificador o etiquetas del creador.
  * Botones de acción (Editar/Eliminar) **condicionados por el backend/frontend**.
  * Valida ya la navegacion entre estas ya que en el proyecto se selecciona los botones y no navegan a la ventana correspondiente

---

## 2. Lógica de Negocio y Seguridad: Control de Autorización CRUD
El sistema debe validar de forma estricta quién es el propietario (creador) de cada producto antes de permitir cualquier modificación.

### A. Reglas de Permisos en la Vista (Frontend)
* **Si el usuario actual ES el creador del producto:**
  * Se deben renderizar de forma visible los botones para **Actualizar (Editar)** y **Eliminar**.
  * El usuario tiene acceso al flujo del CRUD completo para ese elemento en específico.
* **Si el usuario actual NO es el creador del producto:**
  * Los botones de **Actualizar** y **Eliminar** deben estar completamente **ocultos** o deshabilitados para ese producto.
  * El usuario solo tendrá permisos de lectura (Ver el producto en el Grid).

### B. Validación de Seguridad (Backend)
* No basta con ocultar los botones en la interfaz. Las rutas del servidor (API endpoints) para `PUT/PATCH` (actualizar) y `DELETE` (eliminar) deben incluir un middleware de verificación.
* **Flujo de validación:**
  1. Capturar el `ID` del usuario autenticado (desde el token/sesión).
  2. Buscar el producto en la base de datos y extraer el `creator_id`.
  3. Comparar ambos IDs:
     * Si coinciden: Se procesa la petición de forma exitosa.
     * Si NO coinciden: Retornar un error de autorización (`403 Forbidden`).