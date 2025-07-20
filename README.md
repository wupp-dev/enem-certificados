# Certificados ENEM

Generador de certificados en PDF para el XXVI Encuentro Nacional de Estudiantes de Matemáticas (ENEM).

## ¿Qué hace?

Genera certificados personalizados en PDF a partir de los datos de un archivo `certificates.csv`, usando una plantilla HTML y añadiendo imágenes decorativas.

## Uso

1. Instala las dependencias:
   ```sh
   pnpm install
   ```
2. Coloca el archivo `certificates.csv` en la raíz del proyecto con el siguiente formato:
   ```csv
   nombre,tipoNif,nif
   Juan Pérez Fernández,DNI,12345678A
   María López Hurtado,NIE,X1234567Y
   ...
   ```
   (Las columnas `day`, `month` y `year` se generan automáticamente con la fecha actual)
3. Ejecuta el generador:
   ```sh
   pnpm start
   ```
4. Los certificados PDF se guardarán en la carpeta `output/` con el nombre `{nif}.pdf`.

## Personalización

- Edita la plantilla en `src/template.html` para cambiar el diseño o el texto.
- Las imágenes decorativas se leen de `src/assets/mosaico.png` y `src/assets/roseton.png`.
