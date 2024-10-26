declare namespace JSX {
  interface IntrinsicElements {
    inner: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}
