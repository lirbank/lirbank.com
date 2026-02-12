/** @jsx h */

/**
 * OG image markup for blog post share cards (1200x630)
 *
 * Uses a tiny JSX factory so we can write readable markup that compiles
 * directly to the { type, props } objects Satori expects — no React needed.
 */

declare global {
  namespace JSX {
    type Element = { type: string; props: Record<string, unknown> };
    interface IntrinsicElements {
      [tag: string]: Record<string, unknown>;
    }
  }
}

function h(
  type: string,
  props: Record<string, unknown> | null,
  ...children: unknown[]
) {
  return {
    type,
    props: {
      ...props,
      children: children.length > 1 ? children : children[0],
    },
  };
}

export const WIDTH = 1200;
export const HEIGHT = 630;

const colors = {
  stone100: "rgb(245, 245, 244)",
  stone200: "rgb(231, 229, 228)",
  stone400: "rgb(168, 162, 158)",
  stone800: "rgb(41, 37, 36)",
};

export function createMarkup(title: string, description: string) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: colors.stone100,
        padding: "60px 80px",
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: colors.stone800,
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 26,
              color: colors.stone400,
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `2px solid ${colors.stone200}`,
          paddingTop: 24,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, color: colors.stone800 }}>
          Mikael Lirbank
        </div>
        <div style={{ fontSize: 22, color: colors.stone400 }}>lirbank.com</div>
      </div>
    </div>
  );
}
