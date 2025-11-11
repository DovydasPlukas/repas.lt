import React from 'react';

const PrivacyNotice: React.FC = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[--RepasBlue] px-6 py-16 text-primary-foreground md:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-balance font-sans text-4xl font-bold md:text-5xl lg:text-6xl">
            Privatumo politika
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
            Jūsų privatumo apsauga mums yra svarbi
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">1. Bendrosios nuostatos</h2>
              <p className="text-gray-600 leading-relaxed">
                Ši privatumo politika nustato pagrindinius asmens duomenų rinkimo, tvarkymo ir saugojimo principus bei taisykles, kai asmens duomenis tvarko UAB &quot;Repas&quot;.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">2. Kokius duomenis renkame</h2>
              <p className="text-gray-600 leading-relaxed">
                Mes renkame šiuos asmens duomenis:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Vardą ir pavardę</li>
                <li>Kontaktinius duomenis (telefoną, el. paštą)</li>
                <li>Pristatymo adresą</li>
                <li>Užsakymų istoriją</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">3. Duomenų naudojimo tikslai</h2>
              <p className="text-gray-600 leading-relaxed">
                Jūsų asmens duomenys naudojami šiais tikslais:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Paslaugų teikimui ir užsakymų vykdymui</li>
                <li>Atsiskaitymų administravimui</li>
                <li>Klientų aptarnavimui</li>
                <li>Teisinių įsipareigojimų vykdymui</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">4. Duomenų saugojimas</h2>
              <p className="text-gray-600 leading-relaxed">
                Asmens duomenys saugomi tik tiek laiko, kiek būtina nustatytiems tikslams pasiekti arba teisės aktų nustatyta tvarka. Užtikriname duomenų saugumą taikydami tinkamas technines ir organizacines priemones.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">5. Jūsų teisės</h2>
              <p className="text-gray-600 leading-relaxed">
                Jūs turite teisę:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Susipažinti su savo asmens duomenimis</li>
                <li>Prašyti ištaisyti neteisingus duomenis</li>
                <li>Prašyti ištrinti duomenis (&quot;teisė būti pamirštam&quot;)</li>
                <li>Apriboti duomenų tvarkymą</li>
                <li>Nesutikti su duomenų tvarkymu</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">6. Susisiekite</h2>
              <p className="text-gray-600 leading-relaxed">
                Jei turite klausimų dėl savo asmens duomenų tvarkymo, galite susisiekti su mumis el. paštu: repas@repas.lt
              </p>
            </div>

            <div className="mt-12 pt-8 border-t">
              <p className="text-sm text-gray-500">
                Paskutinį kartą atnaujinta: 2025 m. lapkričio 8 d.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyNotice;