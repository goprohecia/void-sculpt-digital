import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
}

interface SignaturePadProps {
  onSignatureChange?: (isEmpty: boolean) => void;
  width?: number;
  height?: number;
}

const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ onSignatureChange, height = 160 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const hasDrawn = useRef(false);

    const getCtx = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
      return ctx;
    }, []);

    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, rect.width, height);
      }
    }, [height]);

    useEffect(() => {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }, [resizeCanvas]);

    const getPos = (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        const touch = e.touches[0];
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      }
      return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
    };

    const startDraw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawing.current = true;
      const ctx = getCtx();
      if (!ctx) return;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!isDrawing.current) return;
      const ctx = getCtx();
      if (!ctx) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      if (!hasDrawn.current) {
        hasDrawn.current = true;
        onSignatureChange?.(false);
      }
    };

    const endDraw = () => {
      isDrawing.current = false;
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.addEventListener("mousedown", startDraw);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", endDraw);
      canvas.addEventListener("mouseleave", endDraw);
      canvas.addEventListener("touchstart", startDraw, { passive: false });
      canvas.addEventListener("touchmove", draw, { passive: false });
      canvas.addEventListener("touchend", endDraw);
      return () => {
        canvas.removeEventListener("mousedown", startDraw);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", endDraw);
        canvas.removeEventListener("mouseleave", endDraw);
        canvas.removeEventListener("touchstart", startDraw);
        canvas.removeEventListener("touchmove", draw);
        canvas.removeEventListener("touchend", endDraw);
      };
    });

    useImperativeHandle(ref, () => ({
      clear: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        hasDrawn.current = false;
        onSignatureChange?.(true);
      },
      isEmpty: () => !hasDrawn.current,
      toDataURL: () => canvasRef.current?.toDataURL("image/png") ?? "",
    }));

    return (
      <div className="w-full">
        <canvas
          ref={canvasRef}
          className="w-full border border-border rounded-md cursor-crosshair bg-white touch-none"
          style={{ height: `${height}px` }}
        />
      </div>
    );
  }
);

SignaturePad.displayName = "SignaturePad";
export default SignaturePad;
