import { Box, Button, Flex, Group, Text } from "@mantine/core"

export const Header = ({connectWallet,provider,signer}:any)=>{
    return <Box p={10} style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
        <Flex justify="space-between">
        <Text fw={700} style={{
            fontSize:"20px",
            color:"#34495e"
        }}>Ethio Web3</Text>

        <Group>
            {provider && <Text>{signer}</Text>}
            {!provider &&<Button onClick={connectWallet}>Connect Wallet</Button>}

            {provider && <Button>Disconnect Wallet</Button>}
        </Group>

        </Flex>
    </Box>
}