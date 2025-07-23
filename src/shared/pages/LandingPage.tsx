import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonApp from '../components/ButtonApp';
import Footer from '../components/Footer';
import Header from '../components/Header';
// import MainPage from '../../features/charge/ui/pages/MainPage';
import SetAmountPage from '../../features/charge/ui/pages/SetAmountPage';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleStartNow = () => navigate('/main');
    const handleSeeDetails = () => navigate('/login');

    const handleJoinWaitlist = () => {
        const waitlistSection = document.getElementById('waitlist');
        if (waitlistSection) {
            waitlistSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

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
        <div className="bg-white">
            <Header />
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-4">
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
                        {/* Texto - Ocupa 8 columnas en desktop */}
                        <div className="lg:col-span-8 text-center lg:text-left space-y-6">
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

                        {/* Teléfono - Ocupa 4 columnas en desktop */}
                        <div className="lg:col-span-4 flex items-center justify-center w-full">
                            <div className="
                                    w-full md:w-13/16 max-w-sm 
                                    h-[80vh] 
                                    bg-black 
                                    rounded-[2.5rem] 
                                    p-2 
                                    shadow-2xl
                                ">
                                {/* Pantalla del teléfono */}
                                <div className="
                                    w-full h-full 
                                    bg-white 
                                    rounded-[2rem] 
                                    overflow-hidden 
                                    relative
                                ">
                                    {/* Notch superior */}
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>

                                    {/* Contenido */}
                                    <div className="w-full h-full pt-8">
                                        <SetAmountPage />
                                    </div>
                                </div>
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
                                Como funciona <span className="text-blue-600">FlowFi Pay</span>
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
                                        onClick={handleJoinWaitlist}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Waitlist Section */}
                <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-20 bg-gradient-to-br from-blue-600 to-blue-800" id='waitlist'>
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold mb-6">
                            Únete a la <span className="text-blue-200">waitlist</span>
                        </h2>
                        <p className="text-lg md:text-xl lg:text-2xl mb-12 text-blue-100 max-w-2xl mx-auto">
                            Sé de los primeros en acceder a FlowFi Pay y revoluciona la forma en que recibes pagos.
                        </p>

                        {/* Formulario */}
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="Tu nombre"
                                    className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-blue-300 bg-white/90 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200"
                                />
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-blue-300 bg-white/90 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="flex justify-center">
                                <ButtonApp
                                    paddingVertical="py-3"
                                    paddingHorizontal="px-8"
                                    text="Unirme a la lista"
                                    textSize="text-base"
                                    backgroundColor="bg-white"
                                    textColor="text-blue-600"
                                    onClick={() => console.log('Joined waitlist')}
                                />
                            </div>
                        </div>

                        <p className="text-sm text-blue-200 mt-6">
                            * Te notificaremos cuando FlowFi Pay esté disponible.
                        </p>
                    </div>
                </section>

                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;