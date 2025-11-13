import { auth, signOut} from "@/auth";


const SettingsPage = async() => {
    const session = await auth();

    return (
    <div className="px-[50px] ">
        <div className="mt-5 w-full bg-black text-white">
            {JSON.stringify(session)}

            <div className="mt-5 text-red-600">
                <form action={async () => {
                    "use server";
                    await signOut();
                }}>
                    <button type="submit">
                        Signout
                    </button>
                </form>
            </div>
         </div>
    </div>
      );
}
 
export default SettingsPage;