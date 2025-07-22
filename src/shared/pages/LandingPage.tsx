import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonApp from '../components/ButtonApp';
import Footer from '../components/Footer';
import OnOffRampPanel from '../../features/exchange/ui/components/OnOffRampPanel';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleStartNow = () => navigate('/on-off-ramp');
    const handleSeeDetails = () => navigate('/login');

    const steps = [
        "1. Crea tu cuenta",
        "2. Realiza el KYC",
        "3. Comienza a cobrar"
    ];

    const features = [
        {
            title: "Pago en cripto",
            description: "Tu cliente paga con USDC (mostrar QR o billetera)."
        },
        {
            title: "Validación",
            description: "Procesamos la transacción on-chain."
        },
        {
            title: "Conversión",
            description: "Automáticamente a pesos al tipo de cambio actual."
        },
        {
            title: "Depósito",
            description: "SPEI directo a tu cuenta bancaria."
        }
    ];

    const products = [
        {
            title: "Dashboard",
            description: "Monitorea pagos y conversiones."
        },
        {
            title: "Conversión automática",
            description: "De USDC (u otras criptos) a pesos."
        },
        {
            title: "Reportes contables",
            description: "Descarga registros para tu contabilidad."
        },
        {
            title: "Soporte multicadena",
            description: "Acepta pagos en la red de Starknet y Base. Más opciones muy pronto."
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-12 items-center max-w-7xl mx-auto">
                    <div className="flex-1 text-center lg:text-left space-y-6">
                        <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight">
                            Acepta pagos con cripto. Recibe Pesos. <span className="text-blue-600">Todo sin friccion.</span>
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
                            Permite que tus clientes te paguen en <span className="text-blue-600 font-semibold">USDC</span>. Nosotros nos encargamos del resto.
                        </p>
                        <div className="flex justify-center lg:justify-start pt-4">
                            <ButtonApp
                                paddingVertical="py-4 md:py-6"
                                paddingHorizontal="px-8 md:px-12"
                                text="Empezar ahora"
                                textSize="text-base md:text-lg"
                                onClick={handleStartNow}
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center w-full">
                        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:w-85">
                            <OnOffRampPanel />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto space-y-24">

                    {/* Steps Section */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-slate-900 mb-12">
                            Facil de iniciar
                        </h2>

                        {/* Mobile: List */}
                        <div className="md:hidden space-y-6">
                            {steps.map((step, index) => (
                                <div key={index} className="text-left pl-6 border-l-4 border-blue-600">
                                    <p className="text-xl font-semibold text-slate-600">
                                        <span className="text-blue-600">{step}</span>
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Desktop: Grid */}
                        <div className="hidden md:grid grid-cols-3 gap-8">
                            {steps.map((step, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-xl lg:text-2xl xl:text-3xl font-semibold text-slate-600">
                                        <span className="text-blue-600">{step}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div>
                        <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-slate-900 mb-16 text-center lg:text-left">
                            Como funciona <span className="text-blue-600">CB POS</span>
                        </h2>

                        <div className="grid xl:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-slate-600 text-base md:text-lg">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src="/illustrations/cryp.png"
                                    alt="Cryptocurrency illustration"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center mt-16">
                            <ButtonApp
                                paddingVertical="py-4 md:py-6"
                                paddingHorizontal="px-8 md:px-12"
                                text="Ver más detalles"
                                textSize="text-base md:text-lg"
                                stroke={true}
                                textColor='text-slate-900'
                                backgroundColor='bg-blue-50'
                                onClick={handleSeeDetails}
                            />
                        </div>
                    </div>

                    {/* Product Section */}
                    <div>
                        <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-slate-900 mb-16 text-center lg:text-left">
                            Nuestro producto
                        </h2>

                        <div className="grid md:grid-cols-2 gap-12">
                            {products.map((product, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-semibold text-blue-600 mb-2">
                                            {product.title}
                                        </h3>
                                        <p className="text-slate-600 text-base md:text-lg">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Sections */}
                    <div className="space-y-20">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-slate-900 mb-8">
                                ¿Y si no se nada de cripto?
                            </h2>
                            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-600 mx-auto lg:mx-0">
                                No necesitas saberlo. Nosotros nos encargamos. Tú solo cobras y <span className='text-blue-600 font-semibold'>recibes tu dinero.</span>
                            </p>
                        </div>

                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-slate-900 mb-12">
                                Acepta pagos sin fronteras. <span className="text-blue-600">Facil y rápido.</span>
                            </h2>

                            <div className="flex justify-center">
                                <ButtonApp
                                    paddingVertical="py-4 md:py-6"
                                    paddingHorizontal="px-8 md:px-12"
                                    text="Empieza hoy"
                                    textSize="text-base md:text-lg"
                                    onClick={handleSeeDetails}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default LandingPage;