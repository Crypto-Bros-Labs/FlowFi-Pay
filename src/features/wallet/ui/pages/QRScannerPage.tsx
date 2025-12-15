import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, XCircle, AlertCircle } from 'lucide-react';
import AppHeader from '../../../../shared/components/AppHeader';
import type { SetAmountDynamicPageProps } from './SetAmountDynamicPage';

const QRScannerPage: React.FC<SetAmountDynamicPageProps> = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scanning, setScanning] = useState(false);

    const [error, setError] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraAvailable, setCameraAvailable] = useState(true);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isMountedRef = useRef(true);

    // Obtener parámetros desde props o location state
    const title = props.title || location.state?.title;
    const token = props.token || location.state?.token;
    const availableCrypto = props.availableCrypto || location.state?.availableCrypto;
    const showSwitchCoin = props.showSwitchCoin !== undefined ? props.showSwitchCoin : location.state?.showSwitchCoin;
    const typeTransaction = props.typeTransaction || location.state?.typeTransaction || 'buy';
    const onContinue = props.onContinue || location.state?.onContinue;

    // Obtener la ruta de origen desde el state
    const returnPath = (location.state as { returnPath?: string })?.returnPath || '/wallet/set-amount';

    const validateAndNavigate = (decodedText: string) => {
        if (!isMountedRef.current) return;

        // Validar formato ethereum:[dirección]
        const ethereumPattern = /^ethereum:(0x[a-fA-F0-9]{1,64})$/;

        if (ethereumPattern.test(decodedText)) {
            setIsProcessing(true);

            // Extraer la dirección
            const address = decodedText.replace('ethereum:', '');

            // Detener el escaneo primero
            if (scannerRef.current && scanning) {
                scannerRef.current.stop()
                    .then(() => {
                        // ✅ Navegar después de que stop() termine
                        // Sin usar isMountedRef aquí porque ya pasó la validación
                        navigate(returnPath, {
                            state: {
                                scannedAddress: address,
                                title,
                                token,
                                availableCrypto,
                                showSwitchCoin,
                                typeTransaction,
                                onContinue
                            },
                            replace: true
                        });
                    })
                    .catch((err) => {
                        console.error('Error al detener escaneo:', err);
                        // ✅ Navegar igual aunque falle el stop
                        navigate(returnPath, {
                            state: {
                                scannedAddress: address,
                                title,
                                token,
                                availableCrypto,
                                showSwitchCoin,
                                typeTransaction,
                                onContinue
                            },
                            replace: true
                        });
                    });
            } else {
                // Si no está escaneando, navega directamente
                navigate(returnPath, {
                    state: {
                        scannedAddress: address,
                        title,
                        token,
                        availableCrypto,
                        showSwitchCoin,
                        typeTransaction,
                        onContinue
                    },
                    replace: true
                });
            }
        } else {
            if (isMountedRef.current) {
                setError('Formato inválido. Debe ser: ethereum:[dirección]');
                setTimeout(() => {
                    if (isMountedRef.current) {
                        setError('');
                    }
                }, 3000);
            }
        }
    };
    const startScanning = async () => {
        try {
            setError('');
            setIsProcessing(false);

            // ✅ Usar containerRef en lugar de id
            if (!containerRef.current) {
                setError('Error: contenedor no encontrado');
                return;
            }

            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode(containerRef.current.id);
            }

            // Verificar disponibilidad de cámaras
            const cameras = await Html5Qrcode.getCameras();

            if (!cameras || cameras.length === 0) {
                setCameraAvailable(false);
                if (isMountedRef.current) {
                    setError('No se detectó ninguna cámara en tu dispositivo.');
                }
                return;
            }

            await scannerRef.current.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    if (!isProcessing && isMountedRef.current) {
                        validateAndNavigate(decodedText);
                    }
                },
                (errorMessage) => {
                    console.warn('Error de escaneo:', errorMessage);
                }
            );

            if (isMountedRef.current) {
                setScanning(true);
                setCameraAvailable(true);
            }
        } catch (err: unknown) {
            if (!isMountedRef.current) return;

            setCameraAvailable(false);

            const errName = typeof err === 'object' && err !== null && 'name' in err && typeof (err as { name?: unknown }).name === 'string'
                ? (err as { name: string }).name
                : undefined;
            const errMessage = err instanceof Error ? err.message : String(err);

            if (errName === 'NotAllowedError') {
                setError('Permiso de cámara denegado. Verifica los permisos en tu navegador.');
            } else if (errName === 'NotFoundError') {
                setError('No se encontró ninguna cámara.');
            } else if (errName === 'NotReadableError') {
                setError('La cámara está en uso por otra aplicación.');
            } else {
                setError('No se pudo acceder a la cámara. ' + (errMessage || ''));
            }

            console.error('Error al iniciar cámara:', err);
        }
    };

    const stopScanning = async () => {
        try {
            if (scannerRef.current && scanning) {
                await scannerRef.current.stop();
                if (isMountedRef.current) {
                    setScanning(false);
                    setError('');
                }
            }
        } catch (err) {
            console.error('Error al detener escaneo:', err);
        }
    };

    const handleBack = async () => {
        isMountedRef.current = false;
        await stopScanning();
        navigate(-1);
    };

    useEffect(() => {
        isMountedRef.current = true;

        // ✅ Forzar que el video llene el contenedor
        const style = document.createElement('style');
        style.textContent = `
            #reader {
                width: 100% !important;
                height: 100% !important;
            }
            #reader video {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
            }
            #reader canvas {
                width: 100% !important;
                height: 100% !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            isMountedRef.current = false;

            // Limpiar estilos
            document.head.removeChild(style);

            (async () => {
                if (scannerRef.current) {
                    try {
                        await scannerRef.current.stop();
                    } catch {
                        // Ignorar errores al detener
                    }
                    try {
                        await scannerRef.current.clear();
                    } catch {
                        // Ignorar errores al limpiar
                    }
                }
            })();
        };
    }, []);

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <AppHeader title="Escanear QR" onBack={handleBack} />

            {/* Scanner Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                {/* Video Container */}
                <div className="w-full max-w-sm">
                    {/* ✅ CONTENEDOR SEPARADO - Sin condicionales dentro */}
                    <div
                        ref={containerRef}
                        id="reader"
                        className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 aspect-square"
                    />

                    {/* Overlay FUERA del contenedor */}
                    {!scanning && (
                        <div>
                            <div
                                onClick={cameraAvailable ? startScanning : undefined}
                                className={`absolute top-15 left-1/2 -translate-x-1/2 w-full max-w-sm h-full rounded-2xl flex items-center justify-center z-10 ${cameraAvailable ? 'cursor-pointer hover:bg-gray-50/50' : 'cursor-not-allowed'} transition-colors`}
                            >
                                <div className="text-center">
                                    <Camera className="w-16 h-16 text-blue-500 mx-auto mb-3" />
                                    <p className="text-gray-700 font-medium">
                                        {cameraAvailable ? 'Toca para escanear' : 'Cámara no disponible'}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">Formato: ethereum:0x...</p>
                                </div>
                            </div>
                        </div>

                    )}

                    {/* Permission Error Alert */}
                    {!cameraAvailable && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-yellow-700">Información:</p>
                                <p className="text-yellow-700 text-sm mt-1">
                                    Para usar esta función, debes:
                                </p>
                                <ul className="text-yellow-700 text-sm mt-2 ml-4 list-disc">
                                    <li>Permitir acceso a la cámara en tu navegador</li>
                                    <li>Usar una conexión segura (HTTPS o localhost)</li>
                                    <li>Asegurarte de que otra app no use la cámara</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-red-700">Error:</p>
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    {scanning && (
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={stopScanning}
                                disabled={isProcessing}
                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-5 h-5" />
                                Detener
                            </button>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
};

export default QRScannerPage;