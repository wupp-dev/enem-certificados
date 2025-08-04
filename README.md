# Certificados ENEM

Generador de certificados en PDF para el XXVI Encuentro Nacional de Estudiantes de Matemáticas (ENEM).

## ¿Qué hace?

Genera certificados personalizados en PDF a partir de datos CSV usando plantillas HTML personalizables. Soporta múltiples tipos de certificados con plantillas específicas.

## Estructura del proyecto

```
├── examples/           # Ejemplos HTML de cada plantilla
├── input/             # Archivos CSV de entrada
├── output/            # PDFs generados (organizados por plantilla)
│   ├── attendant/
│   ├── poster/
│   └── ...
├── private/           # Archivos privados (firmas, etc.) - no sincronizados
├── src/
│   ├── templates/     # Plantillas HTML de certificados
│   ├── assets/        # Recursos (imágenes decorativas)
│   └── index.ts       # Código principal
```

## Uso

### Instalación

```sh
pnpm install
```

### Opciones de ejecución

#### 1. Procesamiento automático (recomendado)

```sh
pnpm start
```

- Procesa automáticamente todos los archivos CSV en `input/`
- Para cada CSV busca la plantilla correspondiente en `src/templates/`
- Ejemplo: `input/attendant.csv` → `src/templates/attendant.html` → `output/attendant/`

#### 2. Procesamiento específico

```sh
pnpm start <plantilla> <archivo.csv>
```

- Procesa una plantilla específica con un CSV específico
- Ejemplo: `pnpm start attendant input/attendant.csv`

## Formato de archivos CSV

Los archivos CSV deben incluir estas columnas mínimas:

```csv
id,nombre,tipoNif,nif
1,Juan Pérez Fernández,DNI,12345678A
2,María López Hurtado,NIE,X1234567Y
```

Columnas adicionales según el tipo de certificado:

- `tituloPoster` - Para certificados de pósters
- `cargo` - Para certificados de organización

**Nota:** Las columnas `day`, `month` y `year` se generan automáticamente con la fecha actual.

## Personalización

- **Plantillas:** Edita los archivos en `src/templates/` para cambiar diseño y texto
- **Ejemplos:** Consulta `examples/` para ver cómo se ven las plantillas
- **Recursos:** Las imágenes se cargan desde `src/assets/` y `private/`
- **Archivos privados:** Coloca firmas y otros archivos sensibles en `private/`
