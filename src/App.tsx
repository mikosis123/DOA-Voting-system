import "@mantine/core/styles.css";
import { Box, Button, Flex, MantineProvider, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import "@mantine/notifications/styles.css";
import { Notifications, notifications } from "@mantine/notifications";
import { Header } from "./components/header";
import "./index.css";
import { Proposals } from "./components/proposals";
import { abi, contractAddress } from "./constants/api";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState("");
  const [proposals, setProposals] = useState<any[]>([]);

  const initializeProvider = async () => {
    if (window?.ethereum) {
      await window?.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer.address);
      setProvider(provider);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner("");
  };

  const getProposals = async () => {
    if (provider) {
      const contract = new Contract(contractAddress, abi, provider);
      try {
        const proposals = await contract.getProposal();
        setProposals(proposals);
        console.log({ proposals: proposals });
      } catch (err) {
        console.log({ err });
        notifications.show({
          title: "Error",
          message: "Error while fetching proposals",
          color: "red",
        });
      }
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      console.log("Check connection");
      if (provider) {
        console.log("Check connection 2");
        const contract = new Contract(contractAddress, abi, provider);
        const connectSuccessfully = await contract.connectSuccessfully();
        if (connectSuccessfully) {
          notifications.show({
            title: "Connected",
            message: "Connected successfully",
            color: "green",
          });
        }
        console.log({ connectSuccessfully });
      }
    };

    checkConnection();
    getProposals();
  }, [provider]);

  return (
    <MantineProvider>
      <Notifications />
      <Header
        connectWallet={initializeProvider}
        disconnectWallet={disconnectWallet} // Pass disconnectWallet function
        provider={provider}
        signer={signer}
      />

      <Box p={20}>
        {provider && (
          <>
            <Text fw={500} style={{ fontSize: "20px" }}>
              Proposals
            </Text>
            {proposals.map((proposal, index) => (
              <Proposals
                key={index}
                proposal={proposal}
                signer={signer}
                index={index}
                provider={provider}
              />
            ))}
          </>
        )}
      </Box>

      {!provider && (
        <Flex
          style={{ height: "70vh" }}
          justify="center"
          align="center"
          direction="column"
        >
          <Text fw={700}>Connect your Wallet</Text>
          <Button mt={20} onClick={initializeProvider}>
            Connect
          </Button>
        </Flex>
      )}
    </MantineProvider>
  );
}

export default App;
