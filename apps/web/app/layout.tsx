import './globals.css';

export const metadata = {
  title: 'NeoAgro | NOVA Agriculture',
  description: 'Agrivoltaic intelligence module for NOVA OS.'
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}
