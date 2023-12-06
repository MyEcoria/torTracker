import { Collapse, Text, Grid, createTheme, NextUIProvider } from "@nextui-org/react";
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

export default function App() {
  return (
    <NextUIProvider theme={theme}>
      <div className="mx-auto text-center"> {/* Center the content horizontally and align text to center */}
        <NavBarre></NavBarre>
        <div className="max-w-[350px] sm:max-w-[1000px] mx-auto"> {/* Center the container horizontally */}
          <Grid.Container gap={2} className="justify-center"> {/* Center the grid items horizontally */}
            <Collapse.Group splitted style={{ width: "100%" }}>
              <Grid>
                <Collapse
                  shadow
                  title="General explanations"
                  subtitle="More general explanations"
                >
                </Collapse>
              </Grid>
              <Collapse title="What is TorTracker's goal?">
                <Text>
                  The goal of TorTracker is to practice using different technologies that I have never used.
                </Text>
              </Collapse>
              <Collapse title="What is the collected data used for?">
                <Text>
                  The data collected is useless, this project is purely educational and for the sole purpose of training.
                </Text>
              </Collapse>
            </Collapse.Group>
            <Grid></Grid>
          </Grid.Container>

          <Grid.Container gap={2} className="justify-center"> {/* Center the grid items horizontally */}
            <Collapse.Group splitted style={{ width: "100%" }}>
              <Grid>
                <Collapse
                  shadow
                  title="Technologie"
                  subtitle="More information about technologie"
                >
                </Collapse>
              </Grid>
              <Collapse title="bittorent-dht">
                <Text>
                  Bittorent-dht is the main bittorent protocol peer retrieval technology, so in this project, it is used to retrieve large amounts of ip without downloading the data.
                </Text>
              </Collapse>
            </Collapse.Group>
            <Grid></Grid>
          </Grid.Container>
        </div>
      </div>
    </NextUIProvider>
  );
}