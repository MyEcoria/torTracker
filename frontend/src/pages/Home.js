import { useEffect, useState } from "react";
import {
  Button,
  Text,
  Container,
  Input,
  Image,
  Card,
  createTheme,
  NextUIProvider,
  Table,
} from "@nextui-org/react";
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

const fetchTorrentInfo = async (torrentId) => {
  const response = await fetch(`http://localhost:3001/torrent/${torrentId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch torrent information");
  }
  const torrentInfo = await response.json();
  return torrentInfo;
};

export default function App() {
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ipInfo, setIpInfo] = useState(null);
  const [torrents, setTorrents] = useState([]);
  const [notFound, setNotFound] = useState(null);

  const handleFormSubmission = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(false);
      setSuccess(false);
      setIpInfo(null);
      setNotFound(null);
      setTorrents([]);

      const response = await fetch(`http://localhost:3001/ip/${toAddress}`);
      if (!response.ok) {
        throw new Error("Failed to fetch IP information");
      }
      const ipInfo = await response.json();
      setIpInfo(ipInfo.informations);

      if (ipInfo.informations && ipInfo.informations.id_torrent) {
        const torrentId = ipInfo.informations.id_torrent;
        const torrentInfo = await fetchTorrentInfo(torrentId);
        setTorrents([torrentInfo]);
        setSuccess(true);
        document.getElementById('allForm').style.display = 'none';
      } else {
        setSuccess(false);
        document.getElementById('allForm').style.display = 'none';
        setNotFound(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    // ... code effectue d'autres actions si besoin ...
  }, []);

  return (
    <NextUIProvider theme={theme}>
      <div>
        <NavBarre></NavBarre>

        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
          <Card isHoverable variant="bordered" css={{ maxWidth: "100%", wordBreak: "break-all" }}>
            <div id="allForm">
              <Card.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Card.Header>
                  Search an IP 🔎
                </Card.Header>
                <Card.Divider />
                
                <form onSubmit={handleFormSubmission}>
                  <div class="app-form-group">
                    <br></br>
                    <Input
                      rounded
                      bordered
                      placeholder="xxx.xxx.xxx.xxx                       "
                      color="primary"
                      name="theIP"
                      id="theIP"
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div class="app-form-group buttons">
                    <br></br>
                    <Button shadow color="gradient" auto type="submit"> Send 🚀 </Button>
                  </div>
                </form>
              </Card.Body>
            </div>

            {loading && (
              <div id="loading">
                <Card.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Card.Header>
                    <Text>Loading...</Text>
                  </Card.Header>
                  <Card.Divider />
                  <Image src="https://github.com/MyEcoria/tornano/blob/dev/data/img/XOsX.gif?raw=true" alt="Loading..." />
                </Card.Body>
              </div>
            )}

            {error && (
              <div id="error">
                <Card.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Card.Header>
                    <Text>Error</Text>
                  </Card.Header>
                  <Card.Divider />
                  <Image src="https://github.com/MyEcoria/tornano/blob/dev/data/img/error.gif?raw=true" alt="Error" />
                </Card.Body>
              </div>
            )}

            {notFound && (
              <div id="notFound">
                <Card.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Card.Header>
                    <Text>Ip not found</Text>
                  </Card.Header>
                  <Card.Divider />
                  <Text>I would find it 💣</Text>
                  <Image src="https://media2.giphy.com/media/0RAvDxfdksWy39YG4T/giphy.gif?cid=ecf05e47sw0ttvjonq2788srszetg1fld3pr5999hbk0pgwv&ep=v1_gifs_search&rid=giphy.gif&ct=g" alt="Error" />
                </Card.Body>
              </div>
            )}

            {success && ipInfo && (
            <div id="success" style={{ textAlign: "center" }}>
                <Card.Body>
                <Card.Header>
                    <Text h3>
                    IP: {ipInfo.ip} ({ipInfo.ipCountry})
                    </Text>
                    <Image src={`https://flagsapi.com/${ipInfo.ipCountry}/flat/64.png`} />
                </Card.Header>
                <Card.Divider />
                <br/>

                {torrents.length > 0 ? (
                    <Table
                    bordered
                    shadow={false}
                    selectionMode="multiple"
                    aria-label="Torrents Table"
                    css={{
                        width: "100%",
                        marginTop: "20px",
                    }}
                    >
                    <Table.Header>
                        <Table.Column>ID</Table.Column>
                        <Table.Column>Name</Table.Column>
                        <Table.Column>Magnet</Table.Column>
                        <Table.Column>Download Time</Table.Column>
                        <Table.Column>Image</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {torrents.map((torrent) => (
                        <Table.Row key={torrent.id}>
                            <Table.Cell>{torrent.id}</Table.Cell>
                            <Table.Cell>{torrent.name}</Table.Cell>
                            <Table.Cell>
                            <a href={torrent.magnet} target="_blank" rel="noopener noreferrer">
                                {torrent.magnet}
                            </a>
                            </Table.Cell>
                            <Table.Cell>{ipInfo.date}</Table.Cell>
                            <Table.Cell>
                            <Image src={torrent.img} alt={torrent.name} width={50} height={50} />
                            </Table.Cell>
                        </Table.Row>
                        ))}
                    </Table.Body>
                    </Table>
                ) : (
                    <Text>No torrents found for this IP.</Text>
                )}
                </Card.Body>
            </div>
            )}


          </Card>

        </Container>
      </div>
    </NextUIProvider>
  );
}
