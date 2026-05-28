export default function Explore() {
  return (
    <section className="py-24 bg-surface-container-high">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-8">
              Endless Discovery.
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
              Our conservatory houses over 400 distinct species across five
              climatic zones. From the arid deserts of the Namib to the deep
              aquatic trenches, explore the diversity of life through our
              interactive map.
            </p>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined text-xs">
                    check
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-primary">Live Habitat Feeds</h4>
                  <p className="text-sm text-on-surface-variant">
                    Monitor activity in real-time through our high-definition
                    biological optics.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined text-xs">
                    check
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-primary">
                    Conservation Reports
                  </h4>
                  <p className="text-sm text-on-surface-variant">
                    Access monthly data on species population trends and
                    rewilding efforts.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                className="rounded-2xl w-full h-64 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHinpEm9P4fGNgxN_XDnmS2Ts4NpSyTGBzaLeG1dhojYBidJXqwJXBiUiF2ZLhEX-DHEFsfofC3GoNYI5AD1pw4N8LIXrANiQdkzkNYKKspk2szqOL_NP3NtsvgiseiCmFDIrdJqZeMKa4QjnGjVg7gf7dfJ7WRzJ_vVxqGNxHh2sHRUiSQuxC0_EuMLiYTV5FqHMfDXHRN4qqWmlT7nS_1PUk9AghxbnD3a2mtWAh2hF6H2FngColymN-s5P8zVtizuzYTwVI2YGr"
                alt="Leopard"
              />
              <img
                className="rounded-2xl w-full h-48 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-VKdv3PQdFh2sDh6gMg6P-ehKKVuq1u_ssvHl6cwvFznfmGJ7Q7kI40P8-TC4OoWgWppR--s62EghTP9uRfo6BQvFRdTOkuf3ZmVLkMJxL__dq2TyvBhkwkMzocupb92I9nvjUrvmeAqa79LK4GfBZGodQaz9h7dtr-FkpGWRh2K-reFsMlhtKR6oDLEuG3jAjMiB1fKf0lYf6ZKxyqxBjAeOHs1-OdRJlixMCvCJnHeEFJF7_Ocg8bS1aIA_3kQJ6d8cSR_hxbd5"
                alt="Red Panda"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                className="rounded-2xl w-full h-48 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKQDFPneAiMsxp3uaryDFGI6lLyYB4Sl-Osm39dSQ8FLgdYE7OAxvoOUkSZj1JqtNYxfh0kVX_XTvuh6_vuaAtI7OUgVKZHX4Jt9-gdDLYacXgzA7bsZDn2XAfepz0OwgPEBAucSDL6ey9vZOcdXwFFU55SYExn1cplh20RsQyZTqH_bQDkq6TeJhvx1H0lDgWJXtXHsjWIZIkQzhKNhvRY4YwBO7-eq13uKkVGCka3a5uwWjmJcMLlOfz6i33a7ONjW49VeF4EIpH"
                alt="Cheetah"
              />
              <img
                className="rounded-2xl w-full h-64 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVVmldsY3ypPg5vzZoKJexZWLaLiuZRNquCo10YbVqwv6j4z2I1z_zbUmyy9dalmZxLps1GwRvvoCRXVEeYy3Lh4JiQtv9anf2k0hXyZNG1elheB0a8Tw7hMU0kQymXN-ogTJ6p2VnsJ7MIcHYDYcGUuUuZrjE0SVmhRJwMygtRDFeglRrU4CHyJ_47JPLzbpY0IBgtgxJiSJfxEyxa1vYTrSeFTr88y5XdZA3mzlnO1k4LiZuzCl7WmoSHX6qb-rjTmFz1WV7D2vz"
                alt="Grey Wolf"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
