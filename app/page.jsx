"use client";

import Image from "next/image";
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
  const totalesPorHoras = route.totales_por_horas_cop || route.totales_por_horas;

  return (
    <section className="route-card">
      <div className="route-head">
        <h3 className="route-title">{route.nombre || "Ruta sin nombre"}</h3>
        <span className="route-index">{total > 1 ? `Opcion ${index + 1}` : "Resultado"}</span>
      </div>

      <div className="route-grid">
        {route.id_sice ? (
          <div className="route-stat">
            <span>ID SICE</span>
            <strong>{route.id_sice}</strong>
          </div>
        ) : null}
        {route.total_viaje_cop ? (
          <div className="route-stat">
            <span>Total viaje</span>
            <strong>{route.total_viaje_cop}</strong>
          </div>
        ) : null}
        {route.peajes_cop ? (
          <div className="route-stat">
            <span>Peajes</span>
            <strong>{route.peajes_cop}</strong>
          </div>
        ) : null}
        {totalesPorHoras ? (
          <div className="route-stat" style={{ gridColumn: "1 / -1" }}>
            <span>Totales por horas logisticas</span>
            <strong>
              {Object.entries(totalesPorHoras)
                .map(([key, value]) => `${key}: ${value}`)
                .join(" | ")}
            </strong>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function Page() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [vehiculo, setVehiculo] = useState("C3S3");
  const [carroceria, setCarroceria] = useState("GENERAL");
  const [kmPlano, setKmPlano] = useState("0");
  const [kmOndulado, setKmOndulado] = useState("0");
  const [kmMontanoso, setKmMontanoso] = useState("0");
  const [kmUrbano, setKmUrbano] = useState("0");
  const [kmDespavimentado, setKmDespavimentado] = useState("0");
  const [valorPeajesManual, setValorPeajesManual] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const sumKm =
    Number(kmPlano || 0) +
    Number(kmOndulado || 0) +
    Number(kmMontanoso || 0) +
    Number(kmUrbano || 0) +
    Number(kmDespavimentado || 0);

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
          total_km: sumKm,
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
    <main className="lab-shell">
      <div className="lab-page">
        <header className="topbar">
          <div className="brand-lockup">
            <Image
              src="/atiemppo-logo.png"
              alt="Atiemppo"
              width={626}
              height={148}
              className="brand-logo"
              priority
            />
            <span className="brand-mark">Agencia de agentes · Laboratorio SICETAC manual</span>
          </div>
          <div className="topbar-links">
            <a className="topbar-link" href="https://atiemppo.com/" target="_blank" rel="noreferrer">
              Ir a atiemppo.com
            </a>
            <a className="topbar-link" href="https://sicealinstante.vercel.app/" target="_blank" rel="noreferrer">
              SICETAC al instante
            </a>
            <a className="topbar-link" href="https://www.eldatologistico.com/" target="_blank" rel="noreferrer">
              El Dato Logístico
            </a>
            <a className="topbar-link" href="https://chatgpt.com/g/g-69bb160a06708191a08c3f7177b17306-el-dato-logistico" target="_blank" rel="noreferrer">
              GPT El Dato Logístico
            </a>
          </div>
        </header>

        <section className="hero">
          <article className="hero-card">
            <span className="hero-eyebrow">Laboratorio activo · transporte Colombia</span>
            <h1 className="hero-title">Calcula rutas SICETAC con criterio manual y contexto operativo.</h1>
            <p className="hero-copy">
              Esta version sirve para estimar una ruta aunque no exista exactamente en el flujo tradicional.
              Defines kilometros por tipo de via, peajes y configuracion vehicular, y el laboratorio devuelve
              una lectura util para pruebas, exploracion y validacion operativa.
            </p>
            <div className="hero-actions">
              <a className="hero-link primary" href="#formulario">
                Iniciar calculo manual
              </a>
              <a className="hero-link" href="https://atiemppo.com/#labs" target="_blank" rel="noreferrer">
                Ver el ecosistema Atiemppo
              </a>
              <a className="hero-link" href="https://www.eldatologistico.com/" target="_blank" rel="noreferrer">
                Ir al newsletter
              </a>
              <a className="hero-link" href="https://wa.me/573134503694?text=Hola%2C%20quiero%20consultar%20SICETAC%20al%20Instante%20por%20WhatsApp.%20Escribe%20asi%3A%20origen%20a%20destino" target="_blank" rel="noreferrer">
                WhatsApp SICETAC
              </a>
            </div>
            <div className="hero-metrics">
              <div className="hero-metric">
                <strong>Modo manual</strong>
                <span>ideal para rutas no parametrizadas o pruebas rapidas</span>
              </div>
              <div className="hero-metric">
                <strong>Kms por terreno</strong>
                <span>plano, ondulado, montañoso, urbano y despavimentado</span>
              </div>
              <div className="hero-metric">
                <strong>Salida resumida</strong>
                <span>resultado listo para lectura de negocio y diagnostico tecnico</span>
              </div>
            </div>
          </article>

          <aside className="info-card">
            <span className="section-kicker">Metodo de uso</span>
            <h2 className="info-title">No es un formulario vacio. Es un laboratorio guiado.</h2>
            <ul className="info-list">
              <li>
                <strong>1. Define el corredor</strong>
                Usa origen y destino como referencia operacional del calculo.
              </li>
              <li>
                <strong>2. Declara el contexto de la via</strong>
                Distribuye la ruta por tipo de terreno y agrega peajes manuales.
              </li>
              <li>
                <strong>3. Evalua la salida</strong>
                Compara costos, peajes, totales por horas y diagnostico tecnico.
              </li>
            </ul>
          </aside>
        </section>

        <section className="content-grid">
          <section className="form-card" id="formulario">
            <span className="section-kicker">Captura manual</span>
            <h2 className="form-title">Configura la ruta y calcula.</h2>
            <p className="support-copy">
              El origen y el destino sirven como referencia textual. El calculo depende de los kilometros por tipo
              de via, el valor total de peajes, el vehiculo y la carroceria seleccionada.
            </p>

            <form className="lab-form" onSubmit={onSubmit}>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="origen">Origen de referencia</label>
                  <input
                    id="origen"
                    name="origen"
                    placeholder="Ej. Bogotá"
                    required
                    value={origen}
                    onChange={(e) => setOrigen(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="destino">Destino de referencia</label>
                  <input
                    id="destino"
                    name="destino"
                    placeholder="Ej. Buenaventura"
                    required
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="vehiculo">Tipo de vehiculo</label>
                  <select id="vehiculo" name="vehiculo" value={vehiculo} onChange={(e) => setVehiculo(e.target.value)}>
                    {VEHICLE_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="peajes">Valor total peajes (COP)</label>
                  <input
                    id="peajes"
                    type="number"
                    step="1"
                    min="0"
                    value={valorPeajesManual}
                    onChange={(e) => setValorPeajesManual(e.target.value)}
                  />
                </div>
              </div>

              <div className="section-card">
                <span className="section-kicker">Carroceria</span>
                <p className="support-copy">
                  Selecciona el tipo de carga o carroceria para que el calculo represente mejor la operacion.
                </p>
                <div className="carroceria-grid">
                  {CARROCERIA_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCarroceria(c)}
                      className={`carroceria-chip ${carroceria === c ? "active" : ""}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="section-card km-section">
                <div className="km-section-label">Kilometros por tipo de via</div>
                <p className="support-copy">
                  Puedes dejar valores en cero. El sistema sumara automaticamente todos los kilometros como
                  `total_km`.
                </p>
                <div className="km-grid">
                  <div className="field">
                    <label htmlFor="km-plano">Km plano</label>
                    <input id="km-plano" type="number" step="0.01" min="0" value={kmPlano} onChange={(e) => setKmPlano(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="km-ondulado">Km ondulado</label>
                    <input id="km-ondulado" type="number" step="0.01" min="0" value={kmOndulado} onChange={(e) => setKmOndulado(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="km-montanoso">Km montañoso</label>
                    <input id="km-montanoso" type="number" step="0.01" min="0" value={kmMontanoso} onChange={(e) => setKmMontanoso(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="km-urbano">Km urbano</label>
                    <input id="km-urbano" type="number" step="0.01" min="0" value={kmUrbano} onChange={(e) => setKmUrbano(e.target.value)} />
                  </div>
                  <div className="field field-full">
                    <label htmlFor="km-despavimentado">Km despavimentado</label>
                    <input
                      id="km-despavimentado"
                      type="number"
                      step="0.01"
                      min="0"
                      value={kmDespavimentado}
                      onChange={(e) => setKmDespavimentado(e.target.value)}
                    />
                  </div>
                </div>
                <div className="summary-box">
                  <strong>Suma total de kilometros:</strong> {sumKm.toFixed(2)} km
                  <div>La API usara esta suma como base del calculo manual.</div>
                </div>
              </div>

              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? "Consultando ruta..." : "Calcular ruta en laboratorio"}
              </button>
            </form>
          </section>

          <section className="results-stack">
            <section className="results-card">
              <span className="section-kicker">Resultado</span>
              <h2 className="results-title">Lectura de la consulta</h2>
              <p className="support-copy">
                Aqui ves la salida resumida del laboratorio manual. Si la consulta devuelve mas de una opcion,
                se muestran como alternativas comparables.
              </p>

              {error ? (
                <div className="error-box">
                  <strong>Error:</strong> {error}
                </div>
              ) : null}

              {Array.isArray(result?.warnings) && result.warnings.length > 0 ? (
                <div className="warning-box">
                  <strong>Advertencias:</strong>
                  <ul>
                    {result.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {result?.normalized ? (
                <>
                  <div className="results-meta">
                    <div className="meta-pill">
                      <strong>
                        {result.normalized.meta?.origen || origen} {"->"} {result.normalized.meta?.destino || destino}
                      </strong>
                      <span>Corredor consultado</span>
                    </div>
                    <div className="meta-pill">
                      <strong>{result.normalized.meta?.configuracion || "N/A"}</strong>
                      <span>Configuracion</span>
                    </div>
                    <div className="meta-pill">
                      <strong>{result.normalized.meta?.carroceria || carroceria}</strong>
                      <span>Carroceria</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
                    {Array.isArray(result.normalized.routes) && result.normalized.routes.length > 0 ? (
                      result.normalized.routes.map((route, i) => (
                        <RouteCard
                          key={`${route.id_sice || route.nombre || "route"}-${i}`}
                          route={route}
                          index={i}
                          total={result.normalized.routes.length}
                        />
                      ))
                    ) : (
                      <p className="result-empty">No hay resultados para mostrar.</p>
                    )}
                  </div>

                  <details>
                    <summary>Ver texto resumen</summary>
                    <pre>{result.normalized.texto}</pre>
                  </details>
                  <details>
                    <summary>Ver diagnostico tecnico</summary>
                    <pre>{JSON.stringify({ diagnostics: result.diagnostics || null, raw: result.raw || null }, null, 2)}</pre>
                  </details>
                </>
              ) : (
                <p className="result-empty">
                  Aun no hay calculo. Completa el formulario y ejecuta una consulta para ver rutas, costos y lectura
                  tecnica del laboratorio.
                </p>
              )}
            </section>

            <section className="notes-card">
              <span className="section-kicker">Contexto del laboratorio</span>
              <div className="notes-grid">
                <div className="section-card">
                  <strong>Para que sirve</strong>
                  <p className="support-copy">
                    Explorar rutas, validar escenarios y construir criterio manual cuando necesitas una respuesta
                    rapida con contexto operativo.
                  </p>
                </div>
                <div className="section-card">
                  <strong>Lo que no es</strong>
                  <p className="support-copy">
                    No reemplaza un flujo oficial parametrizado. Es una capa de laboratorio para pruebas y decision
                    asistida.
                  </p>
                </div>
                <div className="section-card">
                  <strong>Accesos directos</strong>
                  <p className="support-copy">
                    También puedes abrir el <a href="https://chatgpt.com/g/g-69bb160a06708191a08c3f7177b17306-el-dato-logistico" target="_blank" rel="noreferrer">GPT de El Dato Logístico</a> o escribir al WhatsApp de SICETAC al Instante.
                    Instrucción: <code>origen a destino</code>. No olvides poner la <code>a</code>.
                  </p>
                </div>
              </div>
              <div className="footer-bar">
                <div>Defaults: este flujo usa modo manual con kms y peajes y presenta resultados para 2, 4 y 8 horas logisticas.</div>
                <div>Conectado con <a href="https://atiemppo.com/" target="_blank" rel="noreferrer">atiemppo.com</a> y <a href="https://www.eldatologistico.com/" target="_blank" rel="noreferrer">El Dato Logístico</a>.</div>
                <div>Fuente: Modelo SICETAC · Mintransporte Colombia · Desarrollado por Atiemppo · Febrero 2026.</div>
              </div>
            </section>
          </section>
        </section>
      </div>
    </main>
  );
}
