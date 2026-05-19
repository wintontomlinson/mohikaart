const AnnouncementBar = () => (
  <div
    className="w-full flex items-center justify-center text-center px-4 fixed top-0 inset-x-0 z-[60]"
    style={{
      height: "36px",
      background: "#3D2B1F",
      color: "#FAF7F4",
      fontSize: "12px",
      letterSpacing: "0.04em",
      fontWeight: 500,
    }}
  >
    <span>🎁 Free gift wrap on orders above ₹999 | Ships Pan India</span>
  </div>
);

export default AnnouncementBar;
