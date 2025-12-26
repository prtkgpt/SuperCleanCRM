import Link from "next/link";
import { Plus } from "lucide-react";
import { getClients } from "@/app/actions/clients";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Link
          href="/clients/new"
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>

      <div className="space-y-4">
        {clients.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No clients yet. Tap + to add one.</p>
        ) : (
          clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="block bg-white p-4 rounded-lg shadow border border-gray-100"
            >
              <h3 className="font-semibold text-lg">{client.name}</h3>
              {client.addresses[0] && (
                <p className="text-gray-500 text-sm truncate">
                  {client.addresses[0].street}, {client.addresses[0].city}
                </p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
