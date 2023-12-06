import { useEffect, useState } from "react";
import { Text, Grid, createTheme, NextUIProvider, Card } from "@nextui-org/react";
import { NavBarre } from "../components/navbar";

const theme = createTheme({
    type: "dark", // it could be "light" or "dark"
    theme: {
      colors: {
        // brand colors
        primaryLight: '$green200',
        primaryLightHover: '$green300',
        primaryLightActive: '$green400',
        primaryLightContrast: '$green600',
        primary: '#4ADE7B',
        primaryBorder: '$green500',
        primaryBorderHover: '$green600',
        primarySolidHover: '$green700',
        primarySolidContrast: '$white',
        primaryShadow: '$green500',
  
        gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
        link: '#5E1DAD',
  
        // you can also create your own color
        myColor: '#ff4ecd'
  
        // ...  more colors
      },
      space: {},
      fonts: {}
    }
  })

const fetchTorrentsInfo = async () => {
  const response = await fetch("/info/torrents");
  if (!response.ok) {
    throw new Error("Failed to fetch torrents information");
  }
  const torrentsInfo = await response.json();
  return torrentsInfo.numbers;
};

const fetchPeersInfo = async () => {
  const response = await fetch("/info/peers");
  if (!response.ok) {
    throw new Error("Failed to fetch peers information");
  }
  const peersInfo = await response.json();
  return peersInfo.numbers;
};

export default function App() {
  const [torrentsCount, setTorrentsCount] = useState(0);
  const [peersCount, setPeersCount] = useState(0);

  useEffect(() => {
    // Fetch torrents info and update state
    fetchTorrentsInfo()
      .then((torrentsInfo) => setTorrentsCount(torrentsInfo))
      .catch((error) => console.error("Error fetching torrents info:", error));

    // Fetch peers info and update state
    fetchPeersInfo()
      .then((peersInfo) => setPeersCount(peersInfo))
      .catch((error) => console.error("Error fetching peers info:", error));
  }, []);

  return (
    <NextUIProvider theme={theme}>
      <div className="mx-auto text-center">
        <NavBarre />

      <div className="max-w-[350px] sm:max-w-[1000px] mx-auto">
        <Grid.Container gap={2}>
          <Grid xs={6}>
            <Card>
              <Card.Body>
                <Text h4>Total Torrents</Text>
                <Text>{torrentsCount}</Text>
              </Card.Body>
            </Card>
          </Grid>

          <Grid xs={6}>
            <Card>
              <Card.Body>
                <Text h4>Total Peers</Text>
                <Text>{peersCount}</Text>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
        </div>
      </div>
    </NextUIProvider>
  );
}
