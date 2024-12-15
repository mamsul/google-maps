interface MapMarkerProps extends React.SVGAttributes<SVGElement> {}

export default function MapMarker({ className, ...props }: MapMarkerProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      className={className}
      {...props}
    >
      <circle cx={12} cy={9} r={2.5} fill='currentColor' fillOpacity={0}>
        <animate
          fill='freeze'
          attributeName='fill-opacity'
          begin='0.7s'
          dur='0.15s'
          values='0;1'
        ></animate>
      </circle>
      <path
        fill='none'
        stroke='currentColor'
        strokeDasharray={48}
        strokeDashoffset={48}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 20.5c0 0 -6 -7 -6 -11.5c0 -3.31 2.69 -6 6 -6c3.31 0 6 2.69 6 6c0 4.5 -6 11.5 -6 11.5Z'
      >
        <animate
          fill='freeze'
          attributeName='stroke-dashoffset'
          dur='0.6s'
          values='48;0'
        ></animate>
      </path>
    </svg>
  )
}
