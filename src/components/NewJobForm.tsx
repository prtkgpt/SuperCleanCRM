"use client";

import { createJob } from "@/app/actions/jobs";
import { useActionState } from "react";
import { useState } from "react";
import { Client } from "@prisma/client";

// Define a type for clients
type SimpleClient = {
    id: string;
    name: string;
};

export default function NewJobForm({ clients, prefilledDate }: { clients: SimpleClient[], prefilledDate?: string }) {
    const initialState = { message: "", errors: {} as Record<string, string[]> };
    const [state, action, isPending] = useActionState(createJob, initialState);

    // Default start time: prefilledDate or now, rounded to next hour
    const [startAt, setStartAt] = useState(() => {
        const date = prefilledDate ? new Date(prefilledDate) : new Date();
        if (!prefilledDate) {
            date.setMinutes(0, 0, 0);
            date.setHours(date.getHours() + 1);
        }
        // Format to YYYY-MM-DDTHH:MM for datetime-local
        // Adjust for local timezone offset
        const tzOffset = date.getTimezoneOffset() * 60000;
        return (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
    });

    return (
        <form action={action} className="space-y-4">
             {state.message && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {state.message}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <select name="clientId" required className="w-full p-2 border rounded-md bg-white">
                    <option value="">Select Client</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {state.errors?.clientId && <p className="text-red-500 text-xs mt-1">{state.errors.clientId[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                    name="startAt"
                    type="datetime-local"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md"
                />
                {state.errors?.startAt && <p className="text-red-500 text-xs mt-1">{state.errors.startAt[0]}</p>}
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Duration (min)</label>
                    <input name="duration" type="number" defaultValue={120} step={15} required className="w-full p-2 border rounded-md" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Price ($)</label>
                    <input name="price" type="number" defaultValue={100} required className="w-full p-2 border rounded-md" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Service Type</label>
                <select name="serviceType" className="w-full p-2 border rounded-md bg-white">
                    <option value="Standard Clean">Standard Clean</option>
                    <option value="Deep Clean">Deep Clean</option>
                    <option value="Move In/Out">Move In/Out</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Recurrence</label>
                <select name="frequency" className="w-full p-2 border rounded-md bg-white">
                    <option value="ONCE">One-time</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="BIWEEKLY">Bi-weekly (Every 2 weeks)</option>
                    <option value="MONTHLY">Monthly</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea name="notes" className="w-full p-2 border rounded-md" rows={2} />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 mt-6 disabled:bg-blue-300"
            >
                {isPending ? "Scheduling..." : "Schedule Job"}
            </button>
        </form>
    );
}
