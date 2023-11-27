import { useState, useEffect } from "react";
import Wallet from "./components/Wallet/Wallet.js";
import Leaderboard from "./components/leaderboard/Leaderboard.js";
import Footer from "./components/footer/Footer.js";
import Vote from "./components/Vote/Vote.js";


const Home = () => {
    const [state, setState] = useState({
        web: null,
        contract: null,
        accounts: null
    })
    const saveState = (state) => {
        setState(state);
    }

    const [endTime, setEndTime] = useState(null);
    const [winnerName, setWinner] = useState(null);


    useEffect(() => {
        const checkEndTime = async () => {
            const { contract, accounts } = state
            if (!contract) {
                return;
            }
            const endTime = await contract.methods.getVotingEndTime().call();
            const winnerName = await contract.methods.getWinner().call();
            setEndTime(endTime)
            setWinner(winnerName)
        };
        checkEndTime();
    }, [state]);

    return (
        <>
            <div className="main">
                <Wallet saveState={saveState}></Wallet>
                {console.log("winnerName:", winnerName)}
                {(endTime < Date.now()/1000) ? 
                    <div className="headings-container">
                        <h4 className='resultsHeading'>Results</h4> 
                        {(winnerName) ? <h4 className="winner">Candidate "{winnerName}" Won!!</h4> : <></>}
                    </div>
                    : <></>}
                <Leaderboard state={state} isAdminPage={false}/>
                <Vote state={state}/>
            </div>
        </>
    );
};

export default Home;