📱 Cheicon — Aplicación móvil estilo red social

Cheicon es una aplicación móvil desarrollada con React Native + Expo, NativeWind, Zustand y Expo Router, que permite a los usuarios crear publicaciones con imágenes, ver un feed global, comentar, dar likes, manejar su perfil y actualizar su información con imágenes almacenadas en Cloudinary.
La app se conecta a un backend desplegado en Render, utilizando autenticación JWT y endpoints protegidos.

✨ Características principales
🔐 Autenticación

Registro de usuarios

Inicio de sesión con JWT

Persistencia de sesión con AsyncStorage

Validación automática del token al abrir la app

🏠 Feed global

Visualización de todos los posts

Likes en tiempo real

Vista completa con comentarios

📝 Crear publicaciones

Subida de imágenes desde la galería

Validación de título, descripción e imagen

Subida automática a Cloudinary

👤 Perfil de usuario

Vista del perfil (nombre, username, bio, avatar)

Edición del perfil con subida de foto

Actualización dinámica de los datos localmente mediante Zustand

💬 Likes y comentarios

Likes optimistas (la UI responde antes que el servidor)

Se detecta si el usuario ya dio like

Comentarios con avatar del usuario

🛠️ Tecnologías utilizadas
Frontend

React Native (Expo)

Expo Router

NativeWind + TailwindCSS

Zustand

AsyncStorage

React Native Reanimated

Backend (externo)

API REST desplegada en Render

Endpoints protegidos con JWT

Almacenamiento de imágenes

Cloudinary (upload por medio de FormData)

📂 Estructura principal del proyecto
app/
 ├── screens/
 │   ├── login/
 │   ├── signin/
 │   ├── edit.tsx
 │   ├── fullpost/[id].tsx
 │
 ├── (tabs)/
 │    ├── feed/
 │    ├── create-post/
 │    └── profile/
 │
 ├── components/
 │    ├── FeedHeader.tsx
 │    ├── PostCard.tsx
 │    └── CommentCard.tsx
 │
 ├── stores/
 │    └── authStore.tsx
 │
 ├── _layout.tsx
 └── index.tsx

⚙️ Configuración relevante del proyecto
package.json

Incluye Expo, NativeWind, Zustand, Reanimated, AsyncStorage, etc.

app.json

Configuración de Expo, íconos, splash screen, paquete Android, bundleIdentifier de iOS, esquema y EAS.

eas.json

Perfiles:

development

preview (apk interno)

production (apk final)

babel.config.js

Configuración de NativeWind + Expo.

metro.config.js

Integración para usar global.css con NativeWind.

tsconfig.json

Strict mode, soporte de tipos para React Native y NativeWind.

🔄 Flujo general del usuario

Abrir la app
Se verifica la existencia de un token en AsyncStorage.

Si no hay sesión, el usuario va a Login o Signin.

Si hay sesión, se consulta /usuarios/me para validar y obtener datos.

Ingreso al feed, donde ve todos los posts.

Desde la app el usuario puede:

Crear posts

Dar like o quitarlo

Ver posts completos

Comentar

Editar su perfil

▶️ Scripts disponibles
npm start
npm run android
npm run ios
npm run web

💻 EAS Build

Producción:

eas build --platform android --profile production


Preview:

eas build --platform android --profile preview


Local:

eas build --platform android --profile production --local

📜 Licencia

Proyecto creado como parte de la materia Programación de Dispositivos Móviles.
