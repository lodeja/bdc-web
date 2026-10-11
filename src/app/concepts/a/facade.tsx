export function Facade({
  columns,
  rows,
  label,
}: {
  columns: number;
  rows: number;
  label: string;
}) {
  const count = columns * rows;
  return (
    <div className="jdc-a-facade" role="img" aria-label={label}>
      <div className="jdc-a-parapet" />
      <div className="jdc-a-face">
        <div
          className="jdc-a-windows"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: count }, (_, index) => (
            <span
              key={index}
              className={(index * 3 + columns) % 8 === 0 ? "jdc-a-win is-shut" : "jdc-a-win"}
            />
          ))}
        </div>
        <div className="jdc-a-stain" />
        <div className="jdc-a-waterline" />
      </div>
      <div className="jdc-a-plinth" />
    </div>
  );
}
