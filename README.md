# tomasgz7.github.io

Portafolio personal de **Tomas Guzman**: Tech Marketing, Ventas B2B y Business Development.

Sitio: https://tomasgz7.github.io/

## Estructura

```
index.html           Portafolio (una sola página)
privacidad.html      Política de privacidad
terminos.html        Términos y condiciones
404.html             Página de error personalizada
sitemap.xml          Mapa del sitio para buscadores
robots.txt           Reglas para buscadores
site.webmanifest     Datos para instalar el sitio en el celular
favicon.svg / .ico   Íconos del sitio
assets/css/          Estilos
assets/js/main.js    Animaciones, cookies, GA4 y formulario
assets/fonts/        Tipografías locales (sin llamadas a Google Fonts)
assets/img/          Foto, imagen de previsualización e íconos
```

## Configuración (una sola vez)

Abrí `assets/js/main.js` y completá las dos líneas de `CONFIG`:

- `GA_ID`: tu ID de medición de Google Analytics 4 (empieza con `G-`). Mientras esté vacío, no se carga Analytics y no aparece el aviso de cookies.
- `FORM_ENDPOINT`: tu endpoint de Formspree (`https://formspree.io/f/...`). Mientras esté vacío, el formulario abre la app de correo con el mensaje listo.

Los dos valores son públicos por diseño y no son claves secretas.

## Seguridad

- HTTPS forzado (activar "Enforce HTTPS" en Settings → Pages, más redirección en el sitio).
- Content Security Policy en cada página.
- Formulario con honeypot, trampa de tiempo, límite de envíos y filtro de enlaces.
- Sin claves ni secretos en el código.

Hecho a mano con HTML, CSS y JavaScript, sin frameworks. Última publicación: 20/10/2026.
