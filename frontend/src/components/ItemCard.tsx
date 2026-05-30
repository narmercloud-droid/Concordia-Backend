type ItemCardProps = {
  item: any;
  onSelect: (item: any) => void;
};

export default function ItemCard({ item, onSelect }: ItemCardProps) {
  return (
    <button
      onClick={() => onSelect(item)}
      className="group rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
    >
      <div className="mb-2 text-lg font-semibold text-slate-900">{item.name}</div>
      <div className="mb-3 text-sm text-slate-500">{item.description || "Delicious choice"}</div>
      <div className="text-sm font-semibold text-slate-900">€{item.price?.toFixed?.(2) ?? item.price}</div>
    </button>
  );
}
