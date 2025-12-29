import { getJobs } from "@/app/actions/jobs";
import Link from "next/link";
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default async function CalendarPage({ searchParams }: { searchParams: { date?: string, view?: string } }) {
    const { date, view } = await searchParams;
    const currentDate = date ? new Date(date) : new Date();
    // Default to 'day' view for MVP simplicity on mobile
    const currentView = view || 'day';

    const jobs = await getJobs(currentDate);

    // Navigation logic
    const prevDate = subDays(currentDate, 1).toISOString().split('T')[0];
    const nextDate = addDays(currentDate, 1).toISOString().split('T')[0];

    // For week view (simple implementation: just show days of week header and selected day list below?)
    // Or just a strip of days
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        weekDays.push(addDays(weekStart, i));
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            <div className="p-4 bg-white shadow-sm z-10">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">{format(currentDate, "MMMM yyyy")}</h1>
                    <div className="flex gap-2">
                        <Link href={`/calendar?date=${new Date().toISOString().split('T')[0]}`} className="text-sm px-3 py-1 bg-gray-100 rounded">Today</Link>
                    </div>
                </div>

                {/* Week Strip */}
                <div className="flex justify-between md:justify-start md:gap-8 mb-2">
                    {weekDays.map((day) => {
                        const isSelected = isSameDay(day, currentDate);
                        return (
                            <Link
                                key={day.toISOString()}
                                href={`/calendar?date=${day.toISOString().split('T')[0]}`}
                                className={`flex flex-col items-center p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span className="text-xs font-medium">{format(day, "EEE")}</span>
                                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{format(day, "d")}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-gray-500 font-medium">{format(currentDate, "EEEE, MMM d")}</h2>
                    <Link href={`/jobs/new?date=${currentDate.toISOString()}`} className="text-blue-600 font-medium text-sm flex items-center gap-1">
                        <Plus size={16} /> Add Job
                    </Link>
                </div>

                {jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <p>No jobs scheduled.</p>
                        <Link href={`/jobs/new?date=${currentDate.toISOString()}`} className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            + Book Job
                        </Link>
                    </div>
                ) : (
                    jobs.map(job => (
                        <Link key={job.id} href={`/jobs/${job.id}`} className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-gray-900">{format(job.startAt, "h:mm a")}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                    job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                                }`}>{job.status}</span>
                            </div>
                            <h3 className="font-medium text-lg text-gray-800">{job.client.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{job.address?.street}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{job.serviceType || 'Standard'}</span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${job.price}</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
