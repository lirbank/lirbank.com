/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

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

export function createHomepageMarkup(
  title: string,
  description: string,
  name: string,
  logoSrc: ArrayBuffer,
) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: colors.stone100,
        fontFamily: "Inter",
        color: colors.stone900,
      }}
    >
      <div
        style={{
          width: WIDTH,
          height: 16,
          backgroundColor: colors.cyan700,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          padding: "0 96px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 28,
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 96,
            height: 6,
            backgroundColor: colors.cyan700,
            marginBottom: 28,
          }}
        />
        <div
          style={{
            maxWidth: 820,
            color: colors.stone600,
            fontSize: 32,
            lineHeight: 1.45,
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          padding: "0 80px 60px 80px",
          fontSize: 32,
        }}
      >
        <Footer name={name} logoSrc={logoSrc} />
      </div>
    </div>
  );
}

export function createSimplePageMarkup(
  title: string,
  description: string,
  logoSrc: ArrayBuffer,
) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: colors.stone100,
        fontFamily: "Inter",
        color: colors.stone900,
      }}
    >
      <div
        style={{
          width: 24,
          height: HEIGHT,
          backgroundColor: colors.cyan700,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          padding: "80px 120px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 32,
          }}
        >
          {title}
        </div>
        <div
          style={{
            maxWidth: 820,
            color: colors.stone600,
            fontSize: 32,
            lineHeight: 1.45,
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 64,
          display: "flex",
          alignItems: "center",
          gap: 14,
          color: colors.stone600,
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        <img
          src={logoSrc as unknown as string}
          width={36}
          height={36}
          style={{ flexShrink: 0 }}
        />
        <div>Mikael Lirbank</div>
      </div>
    </div>
  );
}

export function createArticleMarkup(
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
      {/* Content section */}
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
        <Footer name="Mikael Lirbank" logoSrc={logoSrc} />
      </div>
    </div>
  );
}

function Footer({ name, logoSrc }: { name: string; logoSrc: ArrayBuffer }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
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
          {name}
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
  );
}
