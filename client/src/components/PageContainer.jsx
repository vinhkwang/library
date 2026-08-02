export default function PageContainer({ title, children }) {
  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}
