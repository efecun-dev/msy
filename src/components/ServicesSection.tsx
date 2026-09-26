import { services } from "@/lib/data";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="py-24 relative bg-gradient-to-b from-transparent via-blue-950/10 to-transparent"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Hizmetlerimiz
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Size Özel{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              Çözümler
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Satış sonrası destek dahil, uçtan uca hizmet anlayışıyla
            yanınızdayız.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-5 group-hover:bg-blue-600/30 group-hover:border-blue-400/50 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-200 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
