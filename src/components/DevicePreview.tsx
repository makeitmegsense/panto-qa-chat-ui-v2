interface DevicePreviewProps {
  steps?: { id: string; label: string; status: string }[];
  running?: boolean;
}

export default function DevicePreview({
  steps = [],
  running = false,
}: DevicePreviewProps) {
  const activeStep = steps.find((s) => s.status === "running");

  return (
    <div className="w-[320px] h-[640px] bg-black/40 rounded-2xl border border-white/10 p-4">
      <div className="text-xs text-white/40 mb-4">
        {running ? "Device Active" : "Device Idle"}
      </div>

      {activeStep && (
        <div className="text-yellow-400 text-sm">
          Executing: {activeStep.label}
        </div>
      )}
    </div>
  );
}