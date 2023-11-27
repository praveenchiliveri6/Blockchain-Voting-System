import { useState, useEffect } from "react";
import './Leaderboard.css'; 
import CandidatesData from "../candidates/Candidatesdata.js";
import Wallet from "../Wallet/Wallet.js";

const Leaderboard = ({refreshKey, isAdminPage}) => {

    const [candidates, setCandidates] = useState([]);

    const saveCandidates= (arr) => {
        setCandidates(arr);
    }

    const [isAdmin, setIsAdmin] = useState(false);
    const [getEndTime, setgetEndTime] = useState(null);

    const [state, setState] = useState({
        web: null,
        contract: null,
        accounts: null
    })
    const saveState = (state) => {
        setState(state);
    }

    useEffect(() => {
        const isAdmin = async () => {
            const { contract, accounts } = state
            if (!contract) {
                return;
            }
            const isAdmin = await contract.methods.checkIfAdminUser(accounts[0]).call();
            // const timeNow = Date.now()
            // const setTime = await contract.methods.updateVotingEndTime(timeNow).send({ from: accounts[0] });
            const getEndtime = await contract.methods.getVotingEndTime().call()
            // const exists = await contract.methods.checkIfVoterIdExists(7893).call()
            setIsAdmin(isAdmin)
            setgetEndTime(getEndtime)
        };
        isAdmin();
    }, [state]);

    return (
        <>
        <Wallet saveState={saveState} />
        <CandidatesData saveCandidates={saveCandidates} refreshKey={refreshKey}/>
        
            <div className="body">
                <div className="table">
                    <div className="table_header">
                        <h1>Candidates List</h1>
                    </div>
                    <div className="table_body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Candidate Name</th>
                                    {
                                        (isAdminPage || (!isAdminPage && (getEndTime < Date.now()/1000))) ? <th>Votes</th> : <></>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((candidate) => (
                                    <tr key={candidate.id}>
                                        <td>{candidate.id}</td>
                                        <td>{candidate.name}</td>
                                        {
                                            (isAdminPage || (!isAdminPage && (getEndTime < Date.now()/1000))) ? <td><strong>{candidate.voteCount}</strong></td> : <></>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Leaderboard;