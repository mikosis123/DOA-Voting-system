import { ActionIcon, Badge, Box, Button, Flex, Text } from "@mantine/core"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { Contract, ethers } from "ethers"
import { useEffect, useState } from "react"
import { abi, contractAddress } from "../constants/api"
import { notifications } from "@mantine/notifications"

export const Proposals = ({proposal,signer,index,provider}:any)=>{
    
   const readContract = new Contract(contractAddress,abi,provider)
   const [isVoted,setIsVoted] = useState(false)

   const vote = async (isUpVoted:boolean)=>{
    const sign = await provider.getSigner()
   const contract = new Contract(contractAddress,abi,sign)
    try{
        console.log({signer})
        await sign.signMessage("message");
                const res = await contract.castVote(index as number,isUpVoted)
        console.log({res})

    }catch(err){
        console.log({err})
        notifications.show({
            title:"Error",
            message:"Error while voting",
            color:"red"
        })
    }
   }

   useEffect(()=>{
    const isVoted = async ()=>{
        try{
            const res = await readContract.hasVoted(signer,index)
            console.log({res})
            setIsVoted(res)
        }catch(err){
            console.log({err})
        }
    }

    isVoted()
   },[])
    return <Box p={20} mt={10} style={{
        border:"1px solid gray",
        width:"max-content",
        cursor:"pointer",
    }}>

        <Flex gap={20}>
            <Box>
        <Text>Proposer  Address : {proposal[0]}</Text>
        <Text>Proposal Title :{proposal[1]}</Text>

            </Box>

            <Flex direction="column">
                <Flex gap={10}>
                <ActionIcon disabled={proposal[4] || isVoted} variant="subtle" onClick={()=>vote(true)}><IconChevronUp/></ActionIcon>
                <Text fw={500}>{proposal[2].toString()}</Text>
                </Flex>
                <Flex gap={10}>
                <ActionIcon  variant="subtle" disabled={proposal[4] || isVoted} onClick={()=>vote(false)}><IconChevronDown/></ActionIcon>
                <Text fw={500}>{proposal[3].toString()}</Text>

                </Flex>
            </Flex>
        </Flex>
        <Flex justify="space-between">
        <Text>Status : {proposal[4] ? <Badge color="red">Closed</Badge> : <Badge color="green">Open</Badge>}</Text>
        
        {signer === proposal[0] &&<Button mt={10} size="xs">Close</Button>}
        </Flex>
    </Box>
}