"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

type DeviceType = "android" | "ios" | "windows" | "macos" | "linux" | "unknown";

type DeviceInfo = {
  label: string;
  type: DeviceType;
  isDesktop: boolean;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

const deviceInfo: Record<DeviceType | "detecting", DeviceInfo> = {
  detecting: {
    label: "Detectando...",
    type: "unknown",
    isDesktop: false,
  },
  android: { label: "Android", type: "android", isDesktop: false },
  ios: { label: "iOS", type: "ios", isDesktop: false },
  windows: { label: "Windows", type: "windows", isDesktop: true },
  macos: { label: "macOS", type: "macos", isDesktop: true },
  linux: { label: "Linux", type: "linux", isDesktop: true },
  unknown: { label: "Desconhecido", type: "unknown", isDesktop: true },
};

const deviceCopy: Record<
  DeviceType,
  {
    intro: string;
    steps: string[];
  }
> = {
  android: {
    intro: "Instale pelo Chrome ou navegador compativel no Android.",
    steps: [
      "Abra o menu do navegador.",
      "Toque em Instalar app ou Adicionar a tela inicial.",
      "Confirme a instalacao e abra pelo icone criado.",
    ],
  },
  ios: {
    intro: "No iPhone ou iPad, a instalacao deve ser feita pelo Safari.",
    steps: [
      "Abra esta pagina no Safari.",
      "Toque no botao de compartilhar.",
      "Escolha Adicionar a Tela de Inicio e confirme.",
    ],
  },
  windows: {
    intro: "No computador, use Chrome ou Edge para instalar o PWA.",
    steps: [
      "Abra o menu do navegador ou o icone de instalacao na barra de endereco.",
      "Clique em Instalar aplicativo.",
      "Depois, abra o app pelo menu iniciar ou atalho criado.",
    ],
  },
  macos: {
    intro: "No Mac, use Safari, Chrome ou Edge para instalar quando disponivel.",
    steps: [
      "Abra as opcoes do navegador.",
      "Procure por Adicionar ao Dock ou Instalar aplicativo.",
      "Confirme e abra pelo icone criado.",
    ],
  },
  linux: {
    intro: "No computador, use um navegador compativel com PWA.",
    steps: [
      "Abra o menu do navegador.",
      "Clique em Instalar aplicativo quando a opcao aparecer.",
      "Abra pelo atalho criado no sistema.",
    ],
  },
  unknown: {
    intro: "Nao conseguimos identificar o dispositivo com precisao.",
    steps: [
      "Abra o menu do navegador.",
      "Procure por Instalar app ou Adicionar a tela inicial.",
      "Confirme a instalacao se a opcao estiver disponivel.",
    ],
  },
};

const defaultDevice: DeviceInfo = {
  ...deviceInfo.detecting,
};

const siteUrl =
  "https://pwa-study-eight.vercel.app/";
const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
  siteUrl,
)}`;

function detectDevice(): DeviceInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  const hasTouchMac =
    platform.includes("mac") && navigator.maxTouchPoints > 1;

  if (userAgent.includes("android")) {
    return deviceInfo.android;
  }

  if (
    userAgent.includes("iphone") ||
    userAgent.includes("ipad") ||
    userAgent.includes("ipod") ||
    hasTouchMac
  ) {
    return deviceInfo.ios;
  }

  if (userAgent.includes("windows")) {
    return deviceInfo.windows;
  }

  if (userAgent.includes("mac os")) {
    return deviceInfo.macos;
  }

  if (userAgent.includes("linux")) {
    return deviceInfo.linux;
  }

  return deviceInfo.unknown;
}

function subscribeToDeviceChanges(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getDeviceSnapshot() {
  return detectDevice();
}

function getServerDeviceSnapshot() {
  return defaultDevice;
}

export default function LandingPage() {
  const router = useRouter();
  const device = useSyncExternalStore(
    subscribeToDeviceChanges,
    getDeviceSnapshot,
    getServerDeviceSnapshot,
  );
  const content = deviceCopy[device.type];

  useEffect(() => {
    const browserStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    const iosStandalone =
      (navigator as NavigatorWithStandalone).standalone === true;

    if (browserStandalone || iosStandalone) {
      router.replace("/aplication");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 text-zinc-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col justify-center gap-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">

            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
                Voce esta no dispositivo: {device.label}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600">
                {content.intro}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">
              Como instalar
            </h2>

            <ol className="mt-4 grid gap-3">
              {content.steps.map((step, index) => (
                <li
                  className="flex gap-3 rounded-md border border-zinc-100 bg-zinc-50 p-3 text-sm leading-6 text-zinc-700"
                  key={step}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {device.isDesktop ? (
          <div className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-md border border-zinc-200 bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`QR code para acessar ${siteUrl}`}
                className="h-full w-full"
                height="160"
                src={qrCodeUrl}
                width="160"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-zinc-950">
                QR code para abrir no celular
              </h2>
              <p className="max-w-xl text-sm leading-6 text-zinc-600">
                Aponte a camera do celular para abrir a landing publicada do
                projeto: {siteUrl}
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
