/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

/**
 * OG image markup for article share cards (1200x630)
 *
 * Uses Satori's built-in JSX runtime (added in 0.26.0) so we get fully typed
 * intrinsic elements and CSS properties without pulling in React.
 */

export const WIDTH = 1200;
export const HEIGHT = 630;

const colors = {
  stone50: "rgb(250, 250, 249)",
  stone100: "rgb(245, 245, 244)",
  stone200: "rgb(231, 229, 228)",
  stone300: "rgb(214, 211, 209)",
  stone400: "rgb(168, 162, 158)",
  stone500: "rgb(120, 113, 108)",
  stone600: "rgb(87, 83, 78)",
  stone700: "rgb(68, 64, 60)",
  stone800: "rgb(41, 37, 36)",
  stone900: "rgb(28, 25, 23)",
  stone950: "rgb(12, 10, 9)",
  cyan700: "rgb(14, 116, 144)",
};

export function createMarkup(
  title: string,
  description: string,
  logoSrc: ArrayBuffer,
) {
  return (
    <div
      style={{
        display: "flex",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: colors.stone100,
        fontFamily: "Inter",
        color: colors.stone900,
        fontSize: 32,
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: 24,
          height: HEIGHT,
          backgroundColor: colors.cyan700,
          flexShrink: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          padding: "100px 80px 80px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 70,
              fontWeight: 800,
              marginBottom: 30,
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* Logo mark */}
            <img
              src={logoSrc as unknown as string}
              width={40}
              height={40}
              style={{ flexShrink: 0 }}
            />
            <div
              style={{
                fontWeight: 600,
              }}
            >
              Mikael Lirbank
            </div>
          </div>
          <div
            style={{
              color: colors.stone600,
            }}
          >
            www.lirbank.com
          </div>
        </div>
      </div>
    </div>
  );
}
