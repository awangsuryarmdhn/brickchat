import Container from "./Container";

type Props = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export default function AppLayout({ header, children }: Props) {
  return (
    <Container>
      {header}
      <div style={{ padding: 12 }}>
        {children}
      </div>
    </Container>
  );
}
