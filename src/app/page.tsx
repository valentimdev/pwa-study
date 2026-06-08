import MobileFeaturesPage from "@/components/mobile-features-page";
import { useState,useEffect } from "react";
export default function Home() {
  const [cameraPhotoUrl, setCameraPhotoUrl] = useState<string | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [locationStatus, setLocationStatus] = useState(
    "Localizacao ainda nao solicitada",
  );
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);

  function handleCameraChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setCameraPhotoUrl(previewUrl);
  }

  function handleUploadChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadFile(file);
    setUploadPreviewUrl(previewUrl);
  }

  function formatFileSize(sizeInBytes: number) {
    const sizeInKb = sizeInBytes / 1024;

    if (sizeInKb < 1024) {
      return `${sizeInKb.toFixed(1)} KB`;
    }

    return `${(sizeInKb / 1024).toFixed(1)} MB`;
  }

  useEffect(() => {
    return () => {
      if (cameraPhotoUrl) {
        URL.revokeObjectURL(cameraPhotoUrl);
      }
    };
  }, [cameraPhotoUrl]);

  useEffect(() => {
    return () => {
      if (uploadPreviewUrl) {
        URL.revokeObjectURL(uploadPreviewUrl);
      }
    };
  }, [uploadPreviewUrl]);

  function handleLocationError(error: GeolocationPositionError) {
    if (error.code === error.PERMISSION_DENIED) {
      setLocationStatus("Permissao de localizacao negada");
      return;
    }

    if (error.code === error.POSITION_UNAVAILABLE) {
      setLocationStatus("Localizacao indisponivel neste momento");
      return;
    }

    if (error.code === error.TIMEOUT) {
      setLocationStatus("Tempo esgotado ao buscar localizacao");
      return;
    }

    setLocationStatus("Nao foi possivel obter a localizacao");
  }

  function handleGetLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus("Este navegador nao suporta geolocalizacao");
      return;
    }

    setLocationStatus("Buscando localizacao...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationStatus("Localizacao encontrada");
      },
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 px-4 py-8 text-zinc-950">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            PWA Study
          </p>
          <h1 className="text-3xl font-semibold">Recursos do celular</h1>
          <p className="max-w-2xl text-sm leading-6 text-zinc-600">
            Uma tela simples para testar camera, localizacao e upload simulado
            usando apenas APIs do navegador.
          </p>
        </header>

        <div className="grid gap-4">
          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Camera</h2>
              <p className="text-sm text-zinc-600">
                Aqui vamos abrir a camera do celular e mostrar a foto abaixo.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white">
                Usar camera
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraChange}
                />
              </label>

              {cameraPhotoUrl ? (
                // Blob previews are local browser URLs, so next/image is not useful here.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="aspect-video w-full rounded-md border border-zinc-200 object-cover"
                  src={cameraPhotoUrl}
                  alt="Foto capturada pela camera"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
                  Nenhuma foto capturada ainda
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Localizacao</h2>
              <p className="text-sm text-zinc-600">
                Aqui vamos pedir permissao e exibir latitude, longitude e
                precisao.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <button
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
                type="button"
                onClick={handleGetLocation}
              >
                Pegar localizacao
              </button>

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm">
                <p className="font-medium text-zinc-700">{locationStatus}</p>

                <dl className="mt-3 grid gap-2 text-zinc-600">
                  <div className="flex items-center justify-between gap-4">
                    <dt>Latitude</dt>
                    <dd className="font-mono text-zinc-950">
                      {location ? location.latitude.toFixed(6) : "-"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Longitude</dt>
                    <dd className="font-mono text-zinc-950">
                      {location ? location.longitude.toFixed(6) : "-"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Precisao</dt>
                    <dd className="font-mono text-zinc-950">
                      {location ? `${Math.round(location.accuracy)}m` : "-"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Upload simulado</h2>
              <p className="text-sm text-zinc-600">
                Aqui vamos selecionar uma imagem, mostrar preview e exibir
                dados do arquivo sem enviar nada para backend.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white">
                Selecionar imagem
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadChange}
                />
              </label>

              {uploadPreviewUrl ? (
                // Blob previews are local browser URLs, so next/image is not useful here.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="aspect-video w-full rounded-md border border-zinc-200 object-cover"
                  src={uploadPreviewUrl}
                  alt="Imagem selecionada para upload simulado"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
                  Nenhuma imagem selecionada ainda
                </div>
              )}

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm">
                <p className="font-medium text-zinc-700">
                  {uploadFile
                    ? "Upload simulado concluido"
                    : "Aguardando arquivo"}
                </p>

                <dl className="mt-3 grid gap-2 text-zinc-600">
                  <div className="flex items-center justify-between gap-4">
                    <dt>Nome</dt>
                    <dd className="truncate text-right font-mono text-zinc-950">
                      {uploadFile ? uploadFile.name : "-"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Tamanho</dt>
                    <dd className="font-mono text-zinc-950">
                      {uploadFile ? formatFileSize(uploadFile.size) : "-"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Tipo</dt>
                    <dd className="font-mono text-zinc-950">
                      {uploadFile ? uploadFile.type || "desconhecido" : "-"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
