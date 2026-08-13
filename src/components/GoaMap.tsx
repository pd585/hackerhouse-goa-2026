import * as maplibregl from "maplibre-gl";
import type { Map as MLMap } from "maplibre-gl";
import type { Feature } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { memo, useCallback, useEffect, useRef } from "react";
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

const CARTO_VOYAGER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "carto-voyager": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto-voyager-layer",
      type: "raster",
      source: "carto-voyager",
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

  const buildSignalFeatures = useCallback((): Feature[] => {
    const features: Feature[] = [];
    const hh = NODES.hackerHouse.coord;
    const cove = NODES.builderCove.coord;
    const bay = NODES.stackBay.coord;
    const team = NODES.teamNode.coord;
    const light = NODES.lighthouse.coord;

    // 1. Stage 01 (builder / enter): Hacker House -> Builder Cove
    if (
      stage === "builder" ||
      stage === "stack" ||
      stage === "team" ||
      stage === "network" ||
      stage === "wave"
    ) {
      features.push({
        type: "Feature",
        properties: { color: "#F4237F", kind: "node-link" }, // Vibrant Neon Pink
        geometry: { type: "LineString", coordinates: arc(hh, cove, 0.12) },
      });
    }

    // 2. Stage 02 (stack): Builder Cove -> Stack Bay (+ tech stack signal arcs)
    if (stage === "stack" || stage === "team" || stage === "network" || stage === "wave") {
      features.push({
        type: "Feature",
        properties: { color: "#0077FF", kind: "node-link" }, // Vibrant Signal Blue
        geometry: { type: "LineString", coordinates: arc(cove, bay, 0.15) },
      });

      // Technology stack arcs from Stack Bay to Hacker House
      stack.forEach((tech, i) => {
        features.push({
          type: "Feature",
          properties: { color: techColor(tech), kind: "stack" },
          geometry: {
            type: "LineString",
            coordinates: arc(bay, hh, 0.08 + i * 0.04),
          },
        });
      });
    }

    // 3. Stage 03 (team): Stack Bay -> Team Node (+ team connection arcs)
    if (stage === "team" || stage === "network" || stage === "wave") {
      features.push({
        type: "Feature",
        properties: { color: "#00E5FF", kind: "node-link" }, // Vibrant Neon Cyan
        geometry: { type: "LineString", coordinates: arc(bay, team, 0.18) },
      });

      if (teamName.trim()) {
        features.push({
          type: "Feature",
          properties: { color: "#F4237F", kind: "team" },
          geometry: {
            type: "LineString",
            coordinates: arc(cove, team, 0.32),
          },
        });
        features.push({
          type: "Feature",
          properties: { color: "#F4237F", kind: "team" },
          geometry: {
            type: "LineString",
            coordinates: arc(team, hh, 0.32),
          },
        });
      }
    }

    // 4. Stage 04 (network / lighthouse): Team Node -> Signal Lighthouse
    if (stage === "network" || stage === "wave") {
      features.push({
        type: "Feature",
        properties: { color: "#10B981", kind: "node-link" }, // Tech Emerald Green
        geometry: { type: "LineString", coordinates: arc(team, light, 0.22) },
      });
    }

    // 5. Stage 05 (wave / Broadcast): Complete Broadcast Network Loop
    if (stage === "wave") {
      features.push({
        type: "Feature",
        properties: { color: "#F5DE19", kind: "broadcast-loop" }, // HackerHouse Gold
        geometry: { type: "LineString", coordinates: arc(light, hh, 0.14) },
      });
      features.push({
        type: "Feature",
        properties: { color: "#00E5FF", kind: "beam" },
        geometry: {
          type: "LineString",
          coordinates: arc(NODES.panaji.coord, light, 0.12),
        },
      });
    }

    return features;
  }, [stack, stage, teamName]);

  const updateSignals = useCallback(() => {
    const m = map.current;
    if (!m || !m.getSource("hh-signals")) return;
    try {
      (m.getSource("hh-signals") as maplibregl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: buildSignalFeatures(),
      });
    } catch (e) {
      console.warn("Signal update warning:", e);
    }
  }, [buildSignalFeatures]);

  useEffect(() => {
    if (!container.current || map.current) return;

    const primaryStyleUrl = "https://tiles.openfreemap.org/styles/bright";

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
      console.warn("Primary vector style failed, using CartoDB Voyager light basemap:", err);
      m = new maplibregl.Map({
        container: container.current,
        style: CARTO_VOYAGER_STYLE,
        center: [73.83, 15.42],
        zoom: 8.6,
        pitch: 40,
        bearing: -12,
        attributionControl: { compact: true },
      });
    }

    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");

    const ensureSignalLayers = () => {
      const instance = map.current;
      if (!instance || !instance.isStyleLoaded()) return;

      try {
        if (!instance.getSource("hh-signals")) {
          instance.addSource("hh-signals", {
            type: "geojson",
            data: { type: "FeatureCollection", features: buildSignalFeatures() },
          });
        }
        if (!instance.getLayer("hh-signals-glow")) {
          instance.addLayer({
            id: "hh-signals-glow",
            type: "line",
            source: "hh-signals",
            paint: {
              "line-color": ["get", "color"],
              "line-width": 10,
              "line-blur": 5,
              "line-opacity": 0.45,
            },
          });
        }
        if (!instance.getLayer("hh-signals-line")) {
          instance.addLayer({
            id: "hh-signals-line",
            type: "line",
            source: "hh-signals",
            paint: {
              "line-color": ["get", "color"],
              "line-width": 3.2,
              "line-opacity": 0.92,
              "line-dasharray": [3, 2],
            },
          });
        }

        if (!ready.current) {
          // Custom Hacker House DOM Markers (centered on node coordinates)
          new maplibregl.Marker({
            element: markerEl("hh", "HACKER HOUSE GOA", "HH26 · GOA NODE", () =>
              enterRef.current(),
            ),
            anchor: "center",
          })
            .setLngLat(NODES.hackerHouse.coord)
            .addTo(instance);
          new maplibregl.Marker({
            element: markerEl("cove", "BUILDER COVE", "IDENTITY"),
            anchor: "center",
          })
            .setLngLat(NODES.builderCove.coord)
            .addTo(instance);
          new maplibregl.Marker({
            element: markerEl("bay", "STACK BAY", "SIGNAL SOURCE"),
            anchor: "center",
          })
            .setLngLat(NODES.stackBay.coord)
            .addTo(instance);
          new maplibregl.Marker({
            element: markerEl("team", "TEAM NODE", "CONNECTION"),
            anchor: "center",
          })
            .setLngLat(NODES.teamNode.coord)
            .addTo(instance);
          new maplibregl.Marker({
            element: markerEl("light", "SIGNAL LIGHTHOUSE", "BROADCAST"),
            anchor: "center",
          })
            .setLngLat(NODES.lighthouse.coord)
            .addTo(instance);

          instance.resize();
          instance.flyTo({ ...CAMERA.enter, duration: 2600, essential: true });
          ready.current = true;
        }

        updateSignals();
      } catch (e) {
        console.error("Signal layer initialization error:", e);
      }
    };

    m.on("error", (e) => {
      console.warn("MapLibre error diagnostic:", e);
      if (!ready.current && map.current) {
        try {
          map.current.setStyle(CARTO_VOYAGER_STYLE);
        } catch {
          /* ignore */
        }
      }
    });

    m.on("style.load", () => {
      m.resize();
      ensureSignalLayers();
    });

    m.on("load", () => {
      ensureSignalLayers();
    });

    // Pulsing signal glow — paused when hidden or in wave stage
    let t = 0;
    let raf: number;
    const tick = () => {
      if (map.current && stageRef.current !== "wave" && !document.hidden) {
        t += 0.02;
        try {
          if (map.current.getLayer("hh-signals-line")) {
            map.current.setPaintProperty(
              "hh-signals-line",
              "line-opacity",
              0.75 + Math.sin(t) * 0.22,
            );
          }
          if (map.current.getLayer("hh-signals-glow")) {
            map.current.setPaintProperty(
              "hh-signals-glow",
              "line-opacity",
              0.38 + Math.sin(t + 1) * 0.15,
            );
          }
        } catch {
          /* layer not ready */
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    m.once("remove", () => cancelAnimationFrame(raf));

    // High-reliability fallback to CARTO_VOYAGER_STYLE if primary style load stalls
    const fallbackTimer = setTimeout(() => {
      if (!ready.current && map.current) {
        try {
          map.current.setStyle(CARTO_VOYAGER_STYLE);
        } catch {
          /* ignore */
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const timer = setTimeout(updateSignals, 150);
    return () => clearTimeout(timer);
  }, [updateSignals]);

  return (
    <div className="absolute inset-0">
      <div ref={container} className="h-full w-full" aria-label="Real 3D map of Goa" />
    </div>
  );
}

const GoaMap = memo(GoaMapComponent);
export default GoaMap;
