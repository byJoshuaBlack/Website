const rays = Array.from({ length: 8 }, (_, index) => {
  const angle = ((index * 45 + 22.5) * Math.PI) / 180;
  const point = (radius: number) => [60 + radius * Math.cos(angle), 60 + radius * Math.sin(angle)].map((value) => value.toFixed(2));
  const [x1, y1] = point(52);
  const [x2, y2] = point(59);
  return { x1, y1, x2, y2 };
});

// A paid order's thumbs-up, in outline only: the pine line draws itself, then loops a jiggle and a
// gap running round the outline. CSS only; under `still` it shows finished, without the rays.
export function ThumbsUp() {
  return (
    <div aria-hidden="true" className="relative mx-auto size-24 md:size-28">
      <svg
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="absolute -inset-5 animate-thumb-burst text-bronze opacity-0 still:hidden"
      >
        {rays.map((ray) => (
          <line key={ray.x1 + ray.y1} {...ray} />
        ))}
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-full origin-bottom-left animate-thumb-lift text-pine still:animate-none"
      >
        <path pathLength={1} d="M7 10v12" className="animate-thumb-draw [stroke-dasharray:1] still:animate-none" />
        <path
          pathLength={1}
          d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
          className="animate-thumb-line [stroke-dasharray:1] still:animate-none"
        />
      </svg>
    </div>
  );
}
