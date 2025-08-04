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

#### 2. Procesamiento por plantilla específica

```sh
pnpm start <plantilla>
```

- Procesa una plantilla específica buscando automáticamente su CSV correspondiente en `input/`
- Ejemplo: `pnpm start custom` busca `input/custom.csv` y usa `src/templates/custom.html`

#### 3. Procesamiento completamente específico

```sh
pnpm start <plantilla> <archivo.csv>
```

- Procesa una plantilla específica con un CSV específico
- Ejemplo: `pnpm start attendant input/attendant.csv`

## Formato de archivos CSV

Los archivos CSV deben incluir estas columnas mínimas:

```csv
id,nombre
1,Juan Pérez Fernández
2,María López Hurtado
```

Columnas adicionales según el tipo de certificado:

- `tipoNif`, `nif` - Para todos los certificados excepto los personalizados (plantilla `custom`)
- `tituloPoster` - Para certificados de pósteres
- `cargo` - Para certificados de organización o voluntarios
- `titulo` - Para el título del documento (plantilla `custom`)
- `texto` - Para certificados personalizados (plantilla `custom`)

**Nota:** Las columnas `day`, `month` y `year` se generan automáticamente con la fecha actual.

### Certificados personalizados (plantilla `custom`)

La plantilla `custom` permite texto completamente personalizable usando HTML:

```csv
id,nombre,titulo,texto
JP,Juan Pérez,Certificado conferenciante XXVI ENEM,"ha impartido la conferencia titulada <b>«Las mates molan»</b> en el <b>XXVI Encuentro Nacional de Estudiantes de Matemáticas (ENEM)</b> celebrado en Granada, entre el 22 y el 27 de julio de 2025 en la Universidad de Granada."
```

## Personalización

- **Plantillas:** Edita los archivos en `src/templates/` para cambiar diseño y texto
- **Ejemplos:** Consulta `examples/` para ver cómo se ven las plantillas
- **Recursos:** Las imágenes se cargan desde `src/assets/` y `private/`
- **Archivos privados:** Coloca firmas y otros archivos sensibles en `private/`
