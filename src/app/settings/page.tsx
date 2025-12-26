import { auth, signOut } from "@/auth";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white p-4 rounded-lg shadow border border-gray-100 mb-6">
        <h2 className="font-semibold text-lg mb-2">Account</h2>
        <p className="text-gray-600 mb-4">{session?.user?.email}</p>

        <form action={async () => {
          "use server"
          await signOut();
        }}>
            <button className="text-red-600 font-medium hover:underline">Sign Out</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border border-gray-100 mb-6">
        <h2 className="font-semibold text-lg mb-2">Business Profile</h2>
        <div className="space-y-3">
             <div>
                <label className="block text-sm text-gray-500">Business Name</label>
                <input type="text" className="w-full border-b py-1" placeholder="My Cleaning Service" />
             </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border border-gray-100 mb-6">
        <h2 className="font-semibold text-lg mb-2">Subscription</h2>
        <p className="text-gray-600 text-sm mb-4">You are on the Free Plan.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Upgrade to Pro ($10/mo)</button>
      </div>

      <div className="text-center text-xs text-gray-400 mt-10">
        App Version 1.0.0
      </div>
    </div>
  );
}
