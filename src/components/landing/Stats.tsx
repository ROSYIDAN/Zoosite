export default function Stats() {
  const stats = [
    {
      name: "African Elephant",
      status: "VULNERABLE",
      statusColor: "bg-secondary",
      icon: "eco",
      diet: "Herbivore",
      lifespan: "60-70 Years",
      habitat: "Savanna & Forest",
    },
    {
      name: "Reticulated Giraffe",
      status: "NEAR THREATENED",
      statusColor: "bg-tertiary",
      icon: "grass",
      diet: "Herbivore",
      lifespan: "20-25 Years",
      habitat: "Savanna",
    },
    {
      name: "Mountain Gorilla",
      status: "CRITICALLY ENDANGERED",
      statusColor: "bg-error",
      icon: "forest",
      diet: "Omnivore",
      lifespan: "35-40 Years",
      habitat: "High Altitude Forest",
    },
  ];

  return (
    <section className="py-32 bg-surface">
      <div className="container mx-auto px-8">
        <div className="flex justify-between items-end mb-16">
          <div className="max-w-xl text-left">
            <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-primary mb-4">
              Vital Statistics
            </h2>
            <p className="text-on-surface-variant font-medium">
              Detailed physiological data harvested from our recent biological
              surveys within the digital archive.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((animal, index) => (
            <div
              key={index}
              className="bg-surface-container-low p-8 rounded-3xl relative overflow-hidden group text-left"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined text-3xl">
                    {animal.icon}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold tracking-widest text-white ${animal.statusColor} px-3 py-1 rounded-full`}
                >
                  {animal.status}
                </span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-6">
                {animal.name}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-outline-variant/20">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Diet
                  </span>
                  <span className="font-bold text-primary">{animal.diet}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-outline-variant/20">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Lifespan
                  </span>
                  <span className="font-bold text-primary">
                    {animal.lifespan}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Habitat
                  </span>
                  <span className="font-bold text-primary">
                    {animal.habitat}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
