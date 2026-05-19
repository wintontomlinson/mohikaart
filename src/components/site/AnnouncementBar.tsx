const AnnouncementBar = () => (
  <div
    className="fixed top-0 inset-x-0 z-[60] flex items-center justify-center"
    style={{
      height: "36px",
      background: "#3D2B1F",
      color: "#ffffff",
      fontSize: "11px",
      letterSpacing: "0.05em",
      fontWeight: 500,
    }}
  >
    🎁 Free gift wrap on orders above ₹999 | Ships Pan India
  </div>
);

export default AnnouncementBar;
