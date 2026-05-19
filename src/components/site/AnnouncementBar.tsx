const AnnouncementBar = () => (
  <div
    className="fixed top-0 inset-x-0 z-[60] flex items-center justify-center bar-shimmer"
    style={{
      height: "38px",
      background: "#3D2B1F",
      color: "rgba(255,255,255,0.9)",
      fontSize: "11px",
      letterSpacing: "0.08em",
      fontWeight: 500,
    }}
  >
    <span className="relative z-10">
      Free gift wrap on orders above Rs.999 | Ships Pan India
    </span>
  </div>
);

export default AnnouncementBar;
