"use client";

import { createClient } from "@/app/actions/clients";
import { useActionState } from "react";

const initialState = {
  message: "",
  errors: {} as Record<string, string[]>,
};

export default function NewClientPage() {
    const [state, action, isPending] = useActionState(createClient, initialState);

    return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Add Client</h1>
      <form action={action} className="space-y-4">
        {state.message && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {state.message}
            </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full p-2 border rounded-md"
            placeholder="Jane Doe"
          />
          {state.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email (Optional)</label>
          <input
            name="email"
            type="email"
            className="w-full p-2 border rounded-md"
            placeholder="jane@example.com"
          />
           {state.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
          <input
            name="phone"
            type="tel"
            className="w-full p-2 border rounded-md"
            placeholder="555-0123"
          />
        </div>

        <div className="pt-4 border-t">
          <h2 className="font-semibold mb-2">Address</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Street</label>
            <input
              name="street"
              type="text"
              required
              className="w-full p-2 border rounded-md"
              placeholder="123 Main St"
            />
            {state.errors?.street && <p className="text-red-500 text-xs mt-1">{state.errors.street[0]}</p>}
          </div>
          <div className="flex gap-2 mt-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                name="city"
                type="text"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="w-20">
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                name="state"
                type="text"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium mb-1">Zip</label>
              <input
                name="zip"
                type="text"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 mt-6 disabled:bg-blue-300"
        >
          {isPending ? "Saving..." : "Save Client"}
        </button>
      </form>
    </div>
  );
}
