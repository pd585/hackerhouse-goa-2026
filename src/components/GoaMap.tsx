import * as maplibregl from "maplibre-gl";
import type { Map as MLMap } from "maplibre-gl";
import type { Feature } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { memo, useEffect, useRef } from "react";
import { NODES, techColor, type Stage } from "@/lib/builder";

interface Props {
  stage: Stage;
  stack: string[];
  teamName: string;
  onEnterNetwork: () => void;
}

const CAMERA: Record<
  Stage,
  { center: [number, number]; zoom: number; pitch: number; bearing: number }
> = {
  enter: { center: NODES.hackerHouse.coord, zoom: 11.2, pitch: 55, bearing: -18 },
  builder: { center: NODES.builderCove.coord, zoom: 14.2, pitch: 62, bearing: 24 },
  stack: { center: NODES.stackBay.coord, zoom: 13.4, pitch: 60, bearing: -40 },
  team: { center: NODES.teamNode.coord, zoom: 14, pitch: 58, bearing: 10 },
  network: { center: [73.86, 15.33], zoom: 9.4, pitch: 52, bearing: -10 },
  lighthouse: { center: NODES.lighthouse.coord, zoom: 14.6, pitch: 70, bearing: 60 },
  wave: { center: NODES.lighthouse.coord, zoom: 12.4, pitch: 64, bearing: 80 },
} as never;

function arc(a: [number, number], b: [number, number], lift = 0.12) {
  const pts: [number, number][] = [];
  const steps = 48;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const nx = -dy;
  const ny = dx;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const bulge = Math.sin(t * Math.PI) * lift;
    pts.push([a[0] + dx * t + nx * bulge, a[1] + dy * t + ny * bulge]);
  }
  return pts;
}

function markerEl(kind: string, label: string, sub: string, onClick?: () => void) {
  const el = document.createElement("div");
  el.className = `hh-marker hh-marker--${kind}`;
  el.innerHTML = `<span class="hh-marker__ring"></span><span class="hh-marker__dot"></span>
    <span class="hh-marker__label"><b>${label}</b><i>${sub}</i></span>`;
  if (onClick) el.addEventListener("click", onClick);
  return el;
}

const CARTO_DARK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto-dark-layer",
      type: "raster",
      source: "carto-dark",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

function GoaMapComponent({ stage, stack, teamName, onEnterNetwork }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const ready = useRef(false);
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const enterRef = useRef(onEnterNetwork);
  enterRef.current = onEnterNetwork;

  useEffect(() => {
    if (!container.current || map.current) return;

    const primaryStyleUrl = "https://tiles.openfreemap.org/styles/liberty";

    let m: MLMap;
    try {
      m = new maplibregl.Map({
        container: container.current,
        style: primaryStyleUrl,
        center: [73.83, 15.42],
        zoom: 8.6,
        pitch: 40,
        bearing: -12,
        attributionControl: { compact: true },
      });
    } catch (err) {
      console.warn("Primary vector style failed, using CartoDB Dark raster basemap:", err);
      m = new maplibregl.Map({
        container: container.current,
        style: CARTO_DARK_STYLE,
        center: [73.83, 15.42],
        zoom: 8.6,
        pitch: 40,
        bearing: -12,
        attributionControl: { compact: true },
      });
    }

    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");

    // Explicit error diagnostic logging
    m.on("error", (e) => {
      console.warn("MapLibre event diagnostic:", e);
      // If primary vector style or tiles throw errors, fallback to CartoDB Dark raster style
      if (!ready.current) {
        try {
          m.setStyle(CARTO_DARK_STYLE);
        } catch {
          /* ignore */
        }
      }
    });

    const setupMapContent = () => {
      if (ready.current || !map.current) return;
      ready.current = true;

      // 1. Signal Layers & Markers (Base Map features)
      try {
        if (!m.getSource("hh-signals")) {
          m.addSource("hh-signals", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          m.addLayer({
            id: "hh-signals-glow",
            type: "line",
            source: "hh-signals",
            paint: {
              "line-color": ["get", "color"],
              "line-width": 9,
              "line-blur": 10,
              "line-opacity": 0.35,
            },
          });
          m.addLayer({
            id: "hh-signals-line",
            type: "line",
            source: "hh-signals",
            paint: {
              "line-color": ["get", "color"],
              "line-width": 2.2,
              "line-dasharray": [2, 3],
            },
          });
        }
      } catch (e) {
        console.warn("Signal layer setup warning:", e);
      }

      // Custom Hacker House markers
      new maplibregl.Marker({
        element: markerEl("hh", "HACKER HOUSE GOA", "HH26 · GOA NODE", () => enterRef.current()),
      })
        .setLngLat(NODES.hackerHouse.coord)
        .addTo(m);
      new maplibregl.Marker({ element: markerEl("cove", "BUILDER COVE", "IDENTITY") })
        .setLngLat(NODES.builderCove.coord)
        .addTo(m);
      new maplibregl.Marker({ element: markerEl("bay", "STACK BAY", "SIGNAL SOURCE") })
        .setLngLat(NODES.stackBay.coord)
        .addTo(m);
      new maplibregl.Marker({ element: markerEl("team", "TEAM NODE", "CONNECTION") })
        .setLngLat(NODES.teamNode.coord)
        .addTo(m);
      new maplibregl.Marker({ element: markerEl("light", "SIGNAL LIGHTHOUSE", "BROADCAST") })
        .setLngLat(NODES.lighthouse.coord)
        .addTo(m);

      m.resize();
      m.flyTo({ ...CAMERA.enter, duration: 2600, essential: true });

      // Pulsing signal glow — paused when hidden or in wave stage
      let t = 0;
      let raf: number;
      const tick = () => {
        if (map.current && stageRef.current !== "wave" && !document.hidden) {
          t += 0.02;
          try {
            m.setPaintProperty("hh-signals-line", "line-opacity", 0.55 + Math.sin(t) * 0.35);
            m.setPaintProperty("hh-signals-glow", "line-opacity", 0.28 + Math.sin(t + 1) * 0.14);
          } catch {
            /* layer not ready */
          }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      m.once("remove", () => cancelAnimationFrame(raf));
    };

    m.on("load", setupMapContent);
    m.on("style.load", () => {
      m.resize();
    });

    // High-reliability fallback if vector style load stalls beyond 1.8s
    const fallbackTimer = setTimeout(() => {
      if (!ready.current && map.current) {
        try {
          m.setStyle(CARTO_DARK_STYLE);
        } catch {
          /* ignore */
        }
        setupMapContent();
      }
    }, 1800);

    const ro = new ResizeObserver(() => m.resize());
    ro.observe(container.current);
    const resizeTimer = setTimeout(() => m.resize(), 150);

    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(resizeTimer);
      ro.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Camera follows the journey.
  useEffect(() => {
    const m = map.current;
    if (!m || !ready.current) return;
    const t = setTimeout(() => m.flyTo({ ...CAMERA[stage], duration: 2400, essential: true }), 120);
    return () => clearTimeout(t);
  }, [stage]);

  // Stack + team drive the real signal routes (debounced to keep typing instant).
  useEffect(() => {
    const m = map.current;
    if (!m || !m.getSource("hh-signals")) return;

    const updateSignals = () => {
      if (!map.current || !map.current.getSource("hh-signals")) return;
      const features: Feature[] = [];
      const hh = NODES.hackerHouse.coord;

      stack.forEach((tech, i) => {
        features.push({
          type: "Feature",
          properties: { color: techColor(tech), kind: "stack" },
          geometry: {
            type: "LineString",
            coordinates: arc(NODES.stackBay.coord, hh, 0.05 + i * 0.035),
          },
        });
      });

      if (stage !== "enter") {
        features.push({
          type: "Feature",
          properties: { color: "#F5DE19", kind: "builder" },
          geometry: { type: "LineString", coordinates: arc(NODES.builderCove.coord, hh, 0.5) },
        });
      }
      if (teamName.trim()) {
        features.push({
          type: "Feature",
          properties: { color: "#F4237F", kind: "team" },
          geometry: {
            type: "LineString",
            coordinates: arc(NODES.builderCove.coord, NODES.teamNode.coord, 0.35),
          },
        });
        features.push({
          type: "Feature",
          properties: { color: "#F4237F", kind: "team" },
          geometry: {
            type: "LineString",
            coordinates: arc(NODES.teamNode.coord, hh, 0.35),
          },
        });
      }
      if (stage === "network" || stage === "wave") {
        features.push({
          type: "Feature",
          properties: { color: "#39D98A", kind: "beam" },
          geometry: { type: "LineString", coordinates: arc(hh, NODES.lighthouse.coord, 0.1) },
        });
        features.push({
          type: "Feature",
          properties: { color: "#4FC3F7", kind: "beam" },
          geometry: {
            type: "LineString",
            coordinates: arc(NODES.panaji.coord, NODES.lighthouse.coord, 0.12),
          },
        });
      }

      (map.current.getSource("hh-signals") as maplibregl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features,
      });
    };

    const timer = setTimeout(updateSignals, 200);
    return () => clearTimeout(timer);
  }, [stack, teamName, stage]);

  return (
    <div className="absolute inset-0">
      <div ref={container} className="h-full w-full" aria-label="Real 3D map of Goa" />
    </div>
  );
}

const GoaMap = memo(GoaMapComponent);
export default GoaMap;
