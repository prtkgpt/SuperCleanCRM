import { getJob, markJobPaid, updateJobStatus } from "@/app/actions/jobs";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CheckCircle, DollarSign, MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const job = await getJob(id);

    if (!job) notFound();

    return (
        <div className="p-4">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-xl font-bold">{job.client.name}</h1>
                    <p className="text-gray-500">{job.address?.street}, {job.address?.city}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    job.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                }`}>
                    {job.status}
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-gray-100 mb-6 space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium">{format(job.startAt, "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium">
                        {format(job.startAt, "h:mm a")} - {job.endAt && format(job.endAt, "h:mm a")}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Service</span>
                    <span className="font-medium">{job.serviceType}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Price</span>
                    <span className="font-medium">${job.price}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Payment</span>
                    <span className={`font-medium ${job.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
                        {job.paymentStatus}
                    </span>
                </div>
                 {job.notes && (
                    <div className="pt-2 border-t mt-2">
                        <span className="text-gray-500 text-sm block mb-1">Notes</span>
                        <p className="text-sm">{job.notes}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                {job.status !== 'COMPLETED' && (
                    <form action={updateJobStatus.bind(null, id, 'COMPLETED')} className="col-span-2">
                         <button className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 flex items-center justify-center gap-2">
                            <CheckCircle size={20} /> Mark Completed
                        </button>
                    </form>
                )}

                {job.paymentStatus !== 'PAID' && (
                     <form action={markJobPaid.bind(null, id)} className="col-span-2">
                        <button className="w-full bg-white border border-blue-600 text-blue-600 py-3 rounded-md font-semibold hover:bg-blue-50 flex items-center justify-center gap-2">
                            <DollarSign size={20} /> Mark Paid (Cash/Check)
                        </button>
                    </form>
                )}

                {/* Placeholder for payment link */}
                {job.paymentStatus !== 'PAID' && (
                     <button disabled className="col-span-2 bg-gray-100 text-gray-400 py-3 rounded-md font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                        <DollarSign size={20} /> Request Payment (Stripe)
                    </button>
                )}

                {/* Placeholder for SMS */}
                <button disabled className="col-span-2 bg-gray-100 text-gray-400 py-3 rounded-md font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                     <MessageSquare size={20} /> Send Reminder
                </button>
            </div>

            <div className="mt-6 text-center">
                <Link href="/calendar" className="text-gray-500 text-sm hover:underline">Back to Calendar</Link>
            </div>
        </div>
    );
}
