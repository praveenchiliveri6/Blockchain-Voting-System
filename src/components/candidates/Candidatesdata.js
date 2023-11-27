// Handles The SaveCandidate Function

import { useState, useEffect } from "react";
import Wallet from "../Wallet/Wallet";

const CandidatesData = ({ saveCandidates, refreshKey }) => {
    const [state, setState] = useState({
        web: null,
        contract: null,
        accounts: null
    })
    const saveState = (state) => {
        setState(state);
    }

    useEffect(()=>{
        const fetchData = async () => {
            const { contract } = state;
            if (!contract) {
                return;
            }
            const totalCandidates = await contract.methods.candidatesCount().call();
            console.log(totalCandidates);
    
            const candidatesData = await contract.methods.getCandidates().call();
            saveCandidates(candidatesData);
            console.log(candidatesData)
        }
        fetchData();
    },[state, refreshKey]);

    return (<>
        <Wallet saveState={saveState} />
    </>);

};

export default CandidatesData;