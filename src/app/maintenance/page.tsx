export const metadata = {
  title: "Under Maintenance",
  description: "We are improving the experience. Please check back soon.",
};

export default function MaintenancePage() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at 20% 20%, #f0fdf4 0%, #dcfce7 35%, #f8fafc 100%)",
        color: "#111827",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "680px",
          border: "1px solid #d1fae5",
          borderRadius: "16px",
          padding: "32px",
          background: "#ffffffee",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "#047857",
            marginBottom: "12px",
          }}
        >
          Temporary Notice
        </p>

        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "12px",
          }}
        >
          We are currently under maintenance
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "#374151",
            maxWidth: "52ch",
            margin: "0 auto",
          }}
        >
          We are making improvements to serve you better. Please check back in a
          little while.
        </p>
      </section>
    </main>
  );
}
