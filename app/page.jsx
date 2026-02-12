"use client";

import { useState } from "react";

const VEHICLE_OPTIONS = ["C278", "C289", "C2910", "C2M10", "C3", "C2S2", "C2S3", "C3S2", "C3S3", "V3"];
const CARROCERIA_OPTIONS = [
  "GENERAL",
  "ESTIBA",
  "PLATAFORMA",
  "ESTACAS GRANEL SOLIDO",
  "ESTIBAS GRANEL SOLIDO",
  "PLATAFORMA GRANEL SOLIDO",
  "FURGON GENERAL",
  "FURGON GRANEL SOLIDO",
  "FURGON REFRIGERADO",
  "PORTACONTENEDORES",
  "TANQUE - GRANEL LIQUIDO",
  "VOLCO",
];

function RouteCard({ route, index, total }) {
  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>
        {total > 1 ? `Ruta ${index + 1}` : "Resultado"}: {route.nombre}
      </h3>
      {route.id_sice ? <p style={{ margin: "4px 0" }}>ID SICE: {route.id_sice}</p> : null}
      {route.total_viaje_cop ? <p style={{ margin: "4px 0" }}>Total viaje: {route.total_viaje_cop}</p> : null}
      {route.peajes_cop ? <p style={{ margin: "4px 0" }}>Peajes: {route.peajes_cop}</p> : null}
      {route.totales_por_horas || route.totales_por_horas_cop ? (
        <p style={{ margin: "4px 0" }}>
          Totales por horas:{" "}
          {Object.entries(route.totales_por_horas_cop || route.totales_por_horas)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" | ")}
        </p>
      ) : null}
    </section>
  );
}

export default function Page() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [vehiculo, setVehiculo] = useState("C3S3");
  const [carroceria, setCarroceria] = useState("GENERAL");
  const [totalKm, setTotalKm] = useState("0");
  const [kmPlano, setKmPlano] = useState("0");
  const [kmOndulado, setKmOndulado] = useState("0");
  const [kmMontanoso, setKmMontanoso] = useState("0");
  const [kmUrbano, setKmUrbano] = useState("0");
  const [kmDespavimentado, setKmDespavimentado] = useState("0");
  const [valorPeajesManual, setValorPeajesManual] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen,
          destino,
          vehiculo,
          carroceria,
          manual_mode: true,
          total_km: Number(totalKm || 0),
          km_plano: Number(kmPlano || 0),
          km_ondulado: Number(kmOndulado || 0),
          km_montanoso: Number(kmMontanoso || 0),
          km_urbano: Number(kmUrbano || 0),
          km_despavimentado: Number(kmDespavimentado || 0),
          valor_peajes_manual: Number(valorPeajesManual || 0),
          resumen: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || data?.detail || "No fue posible consultar la ruta.");
        return;
      }
      setResult(data || null);
    } catch {
      setError("Error de red consultando el servicio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 860, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Sicetac Lab</h1>
      <p>Modo manual: ingresa origen/destino, km por tipo de via y valor manual de peajes.</p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          name="origen"
          placeholder="Origen (ej. Bogota)"
          required
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
        />
        <input
          name="destino"
          placeholder="Destino (ej. Medellin)"
          required
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
        <label>
          Tipo de vehiculo:
          <select
            name="vehiculo"
            value={vehiculo}
            onChange={(e) => setVehiculo(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {VEHICLE_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <div>
          <p style={{ margin: "0 0 6px 0" }}>Tipo de carga / carroceria:</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CARROCERIA_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCarroceria(c)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #999",
                  background: carroceria === c ? "#222" : "#fff",
                  color: carroceria === c ? "#fff" : "#000",
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ margin: 0 }}>Kilometros (acepta 0):</p>
          <input type="number" step="0.01" min="0" value={totalKm} onChange={(e) => setTotalKm(e.target.value)} placeholder="total_km" />
          <input type="number" step="0.01" min="0" value={kmPlano} onChange={(e) => setKmPlano(e.target.value)} placeholder="km_plano" />
          <input type="number" step="0.01" min="0" value={kmOndulado} onChange={(e) => setKmOndulado(e.target.value)} placeholder="km_ondulado" />
          <input type="number" step="0.01" min="0" value={kmMontanoso} onChange={(e) => setKmMontanoso(e.target.value)} placeholder="km_montanoso" />
          <input type="number" step="0.01" min="0" value={kmUrbano} onChange={(e) => setKmUrbano(e.target.value)} placeholder="km_urbano" />
          <input
            type="number"
            step="0.01"
            min="0"
            value={kmDespavimentado}
            onChange={(e) => setKmDespavimentado(e.target.value)}
            placeholder="km_despavimentado"
          />
          <input
            type="number"
            step="1"
            min="0"
            value={valorPeajesManual}
            onChange={(e) => setValorPeajesManual(e.target.value)}
            placeholder="valor_peajes_manual (COP)"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </form>

      {error ? (
        <p style={{ marginTop: 16, color: "#b00020" }}>
          <strong>Error:</strong> {error}
        </p>
      ) : null}
      {Array.isArray(result?.warnings) && result.warnings.length > 0 ? (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #f0ad4e", borderRadius: 8, background: "#fff8e6" }}>
          <strong>Advertencia:</strong>
          <ul style={{ margin: "8px 0 0 16px" }}>
            {result.warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result?.normalized ? (
        <section style={{ marginTop: 20, display: "grid", gap: 12 }}>
          <h2 style={{ marginBottom: 0 }}>
            {result.normalized.meta?.origen} {"->"} {result.normalized.meta?.destino}
          </h2>
          <p style={{ margin: 0 }}>
            Configuracion: {result.normalized.meta?.configuracion || "N/A"} | Mes: {result.normalized.meta?.mes || "N/A"} |
            Carroceria: {result.normalized.meta?.carroceria || "N/A"}
          </p>
          {Array.isArray(result.normalized.routes) && result.normalized.routes.length > 0 ? (
            result.normalized.routes.map((route, i) => (
              <RouteCard
                key={`${route.id_sice || route.nombre}-${i}`}
                route={route}
                index={i}
                total={result.normalized.routes.length}
              />
            ))
          ) : (
            <p>No hay resultados para mostrar.</p>
          )}
          <details>
            <summary>Ver texto resumen</summary>
            <pre style={{ whiteSpace: "pre-wrap" }}>{result.normalized.texto}</pre>
          </details>
          <details>
            <summary>Ver diagnóstico técnico</summary>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(
                { diagnostics: result.diagnostics || null, raw: result.raw || null },
                null,
                2
              )}
            </pre>
          </details>
        </section>
      ) : null}

      <p style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
        Defaults: vehiculo C3S3 y carroceria GENERAL. Este flujo usa payload manual con kms y peajes.
      </p>
    </main>
  );
}
