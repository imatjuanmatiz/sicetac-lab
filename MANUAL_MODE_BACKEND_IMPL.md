# Manual Mode Backend Implementation (Pending)

Fecha: 2026-02-12
Estado: pendiente en backend Python (Render API)

## Objetivo

Cuando `manual_mode=true` en `POST /consulta`, el backend debe:

1. usar kms manuales por tipo de via,
2. usar `valor_peajes_manual` en lugar del calculo de peajes por ruta,
3. mantener resto del modelo igual (parametros, costos fijos, H2/H4/H8).

## Request esperado

```json
{
  "origen": "Bogota",
  "destino": "Medellin",
  "vehiculo": "C3S3",
  "carroceria": "GENERAL",
  "resumen": true,
  "manual_mode": true,
  "total_km": 1000,
  "km_plano": 400,
  "km_ondulado": 300,
  "km_montanoso": 200,
  "km_urbano": 100,
  "km_despavimentado": 0,
  "valor_peajes_manual": 250000
}
```

## Reglas de negocio

1. Si `manual_mode` es `false` o ausente:
- no cambiar comportamiento actual.

2. Si `manual_mode` es `true`:
- no depender de `rutas`/`id_sice` para obtener kms.
- no usar peajes por `id_sice`.
- reemplazar peajes por `valor_peajes_manual`.

3. Validaciones:
- no aceptar negativos en kms ni peajes manuales.
- `0` es valido para todos los campos.
- ruta de 1km es valida.
- `sum_km = km_plano + km_ondulado + km_montanoso + km_urbano + km_despavimentado`.
- `total_km` puede usarse como dato informativo o validacion blanda.

## Contrato de respuesta recomendado

Agregar campos para trazabilidad:

```json
{
  "manual_mode_applied": true,
  "manual_input": {
    "total_km": 1000,
    "km_plano": 400,
    "km_ondulado": 300,
    "km_montanoso": 200,
    "km_urbano": 100,
    "km_despavimentado": 0,
    "valor_peajes_manual": 250000
  }
}
```

Para resumen:
- puede devolver `variantes` con una sola entrada sintetica:
  - `NOMBRE_SICE: "RUTA MANUAL"`
  - `ID_SICE: null`
  - `totales: {H2,H4,H8}`

## Pseudocodigo Python (orientativo)

```python
if payload.manual_mode:
    km = {
        "plano": max(0, payload.km_plano or 0),
        "ondulado": max(0, payload.km_ondulado or 0),
        "montanoso": max(0, payload.km_montanoso or 0),
        "urbano": max(0, payload.km_urbano or 0),
        "despavimentado": max(0, payload.km_despavimentado or 0),
    }
    peajes_manual = max(0, payload.valor_peajes_manual or 0)

    # ejecutar modelo con km manuales
    result_h2 = calcular_modelo(km=km, peajes=peajes_manual, horas_logisticas=2, ...)
    result_h4 = calcular_modelo(km=km, peajes=peajes_manual, horas_logisticas=4, ...)
    result_h8 = calcular_modelo(km=km, peajes=peajes_manual, horas_logisticas=8, ...)

    return {
      "origen": payload.origen,
      "destino": payload.destino,
      "configuracion": payload.vehiculo,
      "carroceria": payload.carroceria,
      "manual_mode_applied": True,
      "manual_input": {...},
      "variantes": [{
        "NOMBRE_SICE": "RUTA MANUAL",
        "ID_SICE": None,
        "totales": {"H2": result_h2.total, "H4": result_h4.total, "H8": result_h8.total}
      }]
    }
```

## Test cases minimos

1. Manual, kms > 0, peajes > 0.
2. Manual, todos kms en 0.
3. Manual, `km_urbano=1`, resto 0.
4. Manual, peajes 0.
5. Manual con valor negativo -> 400.
6. No manual -> respuesta tradicional sin regresion.

## Nota para frontend `sicetac-lab`

Hoy el frontend ya envia `manual_mode` y muestra warning cuando el backend no confirma:

- `"El backend no confirmo la aplicacion de manual_mode..."`

El warning desaparece cuando backend devuelve `manual_mode_applied=true` o `manual_input`.

