import { auth } from "@/auth";


const SettingsPage = async() => {
    const session = await auth();

    return (
    <div className="px-[50px] ">
        <div className="mt-5 w-full bg-black text-white">
            {JSON.stringify(session)}
         </div>
    </div>
      );
}
 
export default SettingsPage;