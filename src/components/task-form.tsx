import { createTask } from "@/app/actions/trackers";

export function TaskForm({ trackerId }: { trackerId: string }) {
  return <form action={createTask} className="mt-4 flex flex-col gap-3 sm:flex-row"><input type="hidden" name="trackerId" value={trackerId} /><input name="title" required maxLength={240} className="min-w-0 flex-1 rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]" placeholder="Add a task" /><select name="priority" defaultValue="medium" className="rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select><button type="submit" className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--primary-deep)]">Add task</button></form>;
}
