import { getClients } from "@/app/actions/clients";
import NewJobForm from "@/components/NewJobForm";
import Link from "next/link";

export default async function NewJobPage({ searchParams }: { searchParams: { date?: string } }) {
    const clients = await getClients();
    const { date } = await searchParams;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">New Job</h1>
            {clients.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">You need to add a client first.</p>
                    <Link href="/clients/new" className="text-blue-600 font-semibold">Add Client</Link>
                </div>
            ) : (
                <NewJobForm clients={clients} prefilledDate={date} />
            )}
        </div>
    );
}
