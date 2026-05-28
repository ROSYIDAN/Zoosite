export default function Teaser() {
  return (
    <section className="py-24 bg-surface-container-low">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <img
              alt="Pygmy Sloth"
              className="rounded-3xl shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj1qB3q8aYnvL_QRSx5CpThngXGSXbbGWhlrwIUz3scPKdnQKTLF8X5azfGcj-fHzZsgQWAH856i9rURxg-OQn9LX3AF-9CQlKoUhbidns1k8grcOOKVQxZkW1tlaPXpeQHn-QpaA_PEstWmH1kaVF2EsiWkETyN4b5jpymFV81n8TDo8d1L6cqB8aJGX8omxpu1NYThnBMxckUrEqtqqzw96K3P5Mn8J-ujJDU-7I9SDLvJjMNBauIajgIukbeGdGwNxf_dFaC87o"
            />
          </div>
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-5xl font-headline font-bold text-on-surface tracking-tight mb-6">
              Three-Toed Sloth
            </h2>
            <div className="bg-surface-container-high p-8 rounded-2xl border-l-4 border-secondary">
              <p className="text-on-surface-variant italic font-medium">
                The three-toed or three-fingered sloths are arboreal neotropical mammals. They are the only members of the genus Bradypus (meaning "slow-footed") and the family Bradypodidae. The five living species of three-toed sloths are the brown-throated sloth, the maned sloth, the pale-throated sloth, the southern maned sloth, and the pygmy three-toed sloth.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-surface-container rounded-2xl border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-3 text-primary">
                  <span className="material-symbols-outlined">eco</span>
                  <h4 className="font-headline font-bold">Living Ecosystem</h4>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Their coarse fur hosts diverse symbiotic organisms, including specialized moths and green algae that provides unique camouflage in the canopy.
                </p>
              </div>
              <div className="p-6 bg-surface-container rounded-2xl border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-3 text-primary">
                  <span className="material-symbols-outlined">battery_low</span>
                  <h4 className="font-headline font-bold">Energy Strategy</h4>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Sloths possess an exceptionally slow metabolic rate, surviving on a low-energy leaf diet through strategic physical and thermal conservation.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
