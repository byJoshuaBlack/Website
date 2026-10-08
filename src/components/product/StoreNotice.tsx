// Holds the order button's place until the online store opens. It is a status, not a control.
export function StoreNotice({ status, note }: { status: string; note?: string }) {
  return (
    <div>
      <p className="flex h-12 items-center justify-center rounded-full border border-rule px-6 text-center text-label text-mute">
        {status}
      </p>
      {note && <p className="mt-4 text-center text-tiny text-mute">{note}</p>}
    </div>
  );
}
