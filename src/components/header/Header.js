import { useState, useEffect } from "react";
import './Header.css';
import Wallet from "../Wallet/Wallet";
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
// *****************
    const [account, setAccount] = useState({
        account: null
    });

    const [connected, setConnected] = useState(false);

    const [state, setState] = useState({
        web: null,
        contract: null,
        accounts: null
    })
    const saveState = (state) => {
        setState(state);
    }

    const [isAdmin, setIsAdmin] = useState(false);

    const saveAccount = (account) => {
        setAccount(account);
    }

    const saveConnected = (status) => {
        setConnected(status)
    }
// *******************

    let navigate = useNavigate();

    const handleAdminClick = () => {
        navigate('/admin');
    };

    const handleHomeClick = () => {
        navigate('/')
    }

    const handleVoterClick = () => {
        navigate('/addVoter')
    }

    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        const isAdmin = async () => {
            const { contract, accounts } = state
            if (!contract) {
                return;
            }
            const isAdmin = await contract.methods.checkIfAdminUser(accounts[0]).call();
            setIsAdmin(isAdmin)
        };
        const checkEndTime = async () => {
            const { contract, accounts } = state
            if (!contract) {
                return;
            }
            const endTime = await contract.methods.getVotingEndTime().call();
            setEndTime(endTime)
        };
        isAdmin();
        checkEndTime();
    }, [state, props.endTime]);

    return (<>

    <Wallet saveState={saveState} saveAccount={saveAccount} saveConnected={saveConnected}/>

        <div className="header">
            <h4 className="appName">BlockSmiths Voting System</h4>
            <button className="adminButton" onClick={handleHomeClick} style={{marginFeft: "50px"}}>
                Home
            </button>
            {connected ? (
                <>
                    {isAdmin ? 
                    <>
                        <button className="adminButton" onClick={handleVoterClick} disabled={endTime > Date.now()/1000}>
                            Add Voter
                        </button>
                        <button className="adminButton" onClick={handleAdminClick}>
                            Admin
                        </button>
                    </> : <></> }
                    <h3 className="connectStatus">Account Connected ({account[0]})</h3>
                </>
            ) : (
                <h3 className="connectStatus">Connect Account to Vote</h3>
            )}
        </div>

    </>);
};

export default Header;