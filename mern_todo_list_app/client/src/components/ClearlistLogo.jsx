function ClearlistLogo({ className = '' }) {
  return (
    <svg
      className={`clearlist-logo ${className}`}
      viewBox="0 0 72 72"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="logo-paper"
        d="M19 8H45L59 22V59C59 62.3 56.3 65 53 65H19C15.7 65 13 62.3 13 59V14C13 10.7 15.7 8 19 8Z"
      />

      <path
        className="logo-fold"
        d="M45 8V22H59"
      />

      <path className="logo-row logo-row-one" d="M28 27H45" />
      <path className="logo-row logo-row-two" d="M28 37H42" />
      <path className="logo-row logo-row-three" d="M28 47H38" />

      <path
        className="logo-check"
        d="M8 39L20 51L51 20"
      />
    </svg>
  );
}

export default ClearlistLogo;
