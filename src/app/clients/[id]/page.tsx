import { getClient, updateClient } from "@/app/actions/clients";
import { notFound } from "next/navigation";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Client</h1>
      <form action={updateClient.bind(null, id)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            type="text"
            defaultValue={client.name}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={client.email || ""}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            name="phone"
            type="tel"
            defaultValue={client.phone || ""}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            defaultValue={client.notes || ""}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        <div className="py-4">
            <h3 className="font-semibold">Addresses</h3>
            {client.addresses.map(addr => (
                <div key={addr.id} className="text-sm text-gray-600 mt-1">
                    {addr.street}, {addr.city}
                </div>
            ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 mt-6"
        >
          Update Client
        </button>
      </form>
    </div>
  );
}
