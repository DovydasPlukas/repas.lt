import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const domain = process.env.NEXT_PUBLIC_APP_URL;

const emailLayout = (content: string) => `
<div style="font-family: Arial, sans-serif; padding: 20px; background: #e4ddd8; line-height: 1.6;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 25px; border-radius: 10px;">

        ${content}

        <p style="text-align: center; margin-top: 30px; color: #494B8B;">
            © ${new Date().getFullYear()} Repas. Visos teisės saugomos.
        </p>
    </div>
</div>
`;

/* ----------------------------------------------
   El. pašto patvirtinimo laiškas
---------------------------------------------- */
export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Patvirtinkite savo el. paštą",
        html: emailLayout(`
            <h2 style="color: #494B8B;">Sveiki,</h2>
            <p>Norėdami patvirtinti savo el. pašto adresą, paspauskite žemiau esantį mygtuką.</p>

            <a href="${confirmLink}" 
                style="display: inline-block; margin-top: 18px; padding: 12px 22px; 
                background-color: #Ea5548; color: white; font-weight: bold;
                text-decoration: none; border-radius: 6px;">
                Patvirtinti el. paštą
            </a>

            <p style="margin-top: 20px;">Jei mygtukas neveikia, paspauskite šią nuorodą:</p>
            <p><a style="color: #494B8B;" href="${confirmLink}">${confirmLink}</a></p>

            <p style="color: #555;">Jeigu neregistravote paskyros, ignoruokite šį laišką.</p>
        `),
    });
};

/* ----------------------------------------------
   Slaptažodžio atkūrimo laiškas
---------------------------------------------- */
export const sendPasswordRestEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Atkurkite savo slaptažodį",
        html: emailLayout(`
            <h2 style="color: #494B8B;">Slaptažodžio atkūrimas</h2>
            <p>Norėdami pakeisti slaptažodį, paspauskite žemiau esantį mygtuką.</p>

            <a href="${resetLink}"
                style="display: inline-block; margin-top: 18px; padding: 12px 22px; 
                background-color: #Ea5548; color: white; font-weight: bold;
                text-decoration: none; border-radius: 6px;">
                Atkurti slaptažodį
            </a>

            <p style="margin-top: 20px;">Jei mygtukas neveikia, paspauskite šią nuorodą:</p>
            <p><a style="color: #494B8B;" href="${resetLink}">${resetLink}</a></p>

            <p style="color: #555;">Jeigu šio veiksmo neprašėte, tiesiog ignoruokite laišką.</p>
        `),
    });
};

/* ----------------------------------------------
   2FA saugos kodas
---------------------------------------------- */
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Jūsų 2FA kodas",
        html: emailLayout(`
            <h2 style="color: #494B8B;">Dviejų faktorių autentifikavimas</h2>
            <p>Jūsų patvirtinimo kodas:</p>

            <div style="font-size: 26px; font-weight: bold; padding: 12px 0; color: #Ea5548;">
                ${token}
            </div>

            <p style="color: #555;">Šis kodas galioja ribotą laiką. Neperduokite jo niekam.</p>
        `),
    });
};
