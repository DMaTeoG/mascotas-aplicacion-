# mascotas-aplicacion-

Frontend web de la plataforma comunitaria inteligente **Huellitas & Rescate** desarrollado con **Next.js 16 (Turbopack)**, **React 19**, **Motion (Framer Motion)** y **Tailwind CSS v4**.

## ✨ Características de la Interfaz

- **Feed Comunitario Táctil**: Exploración de reportes de animales perdidos, encontrados y en adopción con animaciones físicas de resorte (*spring dynamics*).
- **Control de Filtros Deslizante**: Barra de filtros con pastilla flotante que se desplaza fluidamente entre categorías (`layoutId="activeFilterTabIndicator"`).
- **Comparador Inteligente Side-by-Side (XAI)**: Modal comparativo de coincidencias con desglose porcentual explicable de factores (especie, colorimetría, proximidad geográfica y delta temporal).
- **Búsqueda Visual por Imagen**: Modal de deep learning que lista coincidencias visuales ordenadas por similitud de coseno.
- **Formulario de Adopción Responsable**: Flujo guiado para postularse como adoptante y registrar condiciones de bienestar.
- **Módulo de Reclamos Verificados**: Sistema de comprobación de propiedad mediante pruebas secretas y marcas de nacimiento privadas.
- **Perfil y Trazabilidad del Rescatista**: Panel de usuario para gestionar reportes, reclamos y solicitudes de adopción.
- **Micro-interacciones y Accesibilidad**: Animaciones de rebote en reacciones de like, drawers laterales fluidos, toasts dinámicos y soporte completo para `prefers-reduced-motion`.

## 🚀 Instalación y Desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# 3. Compilar para producción
npm run build
npm run start
```

## 🐳 Despliegue con Docker

```bash
docker build -t mascotas-front .
docker run -p 3000:3000 mascotas-front
```

## 📄 Licencia

Desarrollado para el proyecto académico de Programación Orientada a la Web.
