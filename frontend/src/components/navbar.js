import { Navbar, Button, Link, Text } from "@nextui-org/react";

const collapseItems = [
  { label: "Home", href: "/" },
  { label: "Stats", href: "/stats" },
  { label: "FAQ", href: "/faq" },
];

export const NavBarre = () => (
  <Navbar isBordered variant="floating" NormalWeights="white">
    <Navbar.Brand>
      <Navbar.Toggle aria-label="toggle navigation" showIn={"xs"} />
      <Text b color="inherit" hideIn="xs">
        TorTracker
      </Text>
    </Navbar.Brand>
    <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
      <Navbar.Link href="/">Home</Navbar.Link>
      <Navbar.Link href="/stats">Stats</Navbar.Link>
      <Navbar.Link href="/faq">FAQ</Navbar.Link>
    </Navbar.Content>
    <Navbar.Content>
      <Navbar.Link color="inherit" href="https://twitter.com/MyEcoria">
        Twitter
      </Navbar.Link>
      <Navbar.Item>
        <Button auto flat as={Link} href="https://github.com/MyEcoria/torTracker">
          Github
        </Button>
      </Navbar.Item>
    </Navbar.Content>
    <Navbar.Collapse>
      {collapseItems.map((item, index) => (
        <Navbar.CollapseItem key={index}>
          <Link
            color="inherit"
            css={{
              minWidth: "100%",
            }}
            href={item.href}
          >
            {item.label}
          </Link>
        </Navbar.CollapseItem>
      ))}
    </Navbar.Collapse>
  </Navbar>
);