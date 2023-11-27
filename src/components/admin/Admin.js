import React from 'react';
import { useState, useEffect } from "react";
import Leaderboard from '../leaderboard/Leaderboard';
import Wallet from '../Wallet/Wallet';
import UpdateCandi from '../updateCandidate/UpdateCandi';
import "./Admin.css"
import Footer from '../footer/Footer';


const Admin = (props) => {

    const [state, setState] = useState({
        web: null,
        contract: null,
        accounts: null
    })
    const saveState = (state) => {
        setState(state);
    }

    const [refreshKey, setRefreshKey] = useState(0);
    const refreshCandidateList = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        const checkEndTime = async () => {
            const { contract, accounts } = state
            if (!contract) {
                return;
            }
            const endTime = await contract.methods.getVotingEndTime().call();
            setEndTime(endTime)
        };
        checkEndTime();
    }, [state, props.endTime]);

    return (
        <>
            <Wallet saveState={saveState}></Wallet>
            <h4 className='adminHeading'>Admin Panel</h4>
            <UpdateCandi state={state} refreshCandidateList={refreshCandidateList} refreshEndTime={props.refreshEndTime}></UpdateCandi>
            {(endTime > Date.now()/1000) ? 
                <Leaderboard state={state} isAdminPage={true} refreshKey={refreshKey}></Leaderboard>
            : <></>
            }
        </>
    );




};

export default Admin;