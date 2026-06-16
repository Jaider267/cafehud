import { AlertTriangle } from "lucide-react";

const ErrorState = ({ message = "Ups! Algo salió mal con tu pedido.", onRetry }) => (
  <div className="card-premium flex flex-col items-center justify-center p-12 max-w-md mx-auto">
    <div className="w-20 h-20 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-6 border border-red-200/60 dark:border-red-900/40">
      <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
    </div>
    <h3 className="text-xl font-black text-brand-dark mb-2 text-center">Error</h3>
    <p className="text-brand-medium font-medium mb-8 text-center leading-relaxed">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-premium px-8 py-4">
        Reintentar
      </button>
    )}
  </div>
);

export default ErrorState;
