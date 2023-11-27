import { useState, useEffect } from "react";
import CandidatesData from "../candidates/Candidatesdata";
import './Vote.css'; 


const Vote = ({ state }) => {

    const [candidates, setCandidates] = useState([]);
    const [voterId, setVoterId] = useState('');

    const saveCandidates= (arr) => {
        setCandidates(arr);
    }


    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [voted, setVoted] = useState('');

    function openPopup() {
        const popup = document.querySelector('.popup');
        if (popup) {
            popup.classList.add('open-popup');
        }
        if (selectedCandidate) {
            if (voted) {
                alert("You Voted already!")
                console.log("You Voted already!");
            } else {
                handleVote();
            }
        } else {
            closePopup();
            console.log("No candi selected! Caller: openPopupFunc")
            alert("Select a candidate first");
        }

    }

    function closePopup() {
        const popup = document.querySelector('.popup');
        if (popup) {
            popup.classList.remove('open-popup');
        }
    }


    const handleSelectChange = (event) => {
        setSelectedCandidate(event.target.value);
    };

    useEffect(() => {
        const checker = async (event) => {
            const { contract } = state;
            const { accounts } = state;
    
            if (!contract) {
                return;
            }
            const currentAccount = accounts[0];
            const VoteStatus = await contract.methods.voters(currentAccount).call();
            VoteStatus && console.log(VoteStatus)
            setVoted(VoteStatus.hasVoted)
            if (VoteStatus === true) {
                const popuph2 = document.querySelector('.popup-h2');
                const popupP = document.querySelector('.popup-p');
                const popupimg = document.querySelector('.img-popup');
                popuph2.innerHTML = "Sorry!"
                popupP.innerHTML = "You Voted already!"
                if (popupimg) {
                    popupimg.classList.add('img-popup-cross');
                }
            }
        }
        checker();
    }, [state]);

    // const checker = async (event) => {
    //     const { contract } = state;
    //     const { accounts } = state;

    //     if (!contract) {
    //         return;
    //     }
    //     const currentAccount = accounts[0];
    //     const VoteStatus = await contract.methods.voters(currentAccount).call();
    //     VoteStatus && console.log(VoteStatus)
    //     setVoted(VoteStatus);
    //     if (VoteStatus === true) {
    //         const popuph2 = document.querySelector('.popup-h2');
    //         const popupP = document.querySelector('.popup-p');
    //         const popupimg = document.querySelector('.img-popup');
    //         popuph2.innerHTML = "Sorry!"
    //         popupP.innerHTML = "You Voted already!"
    //         if (popupimg) {
    //             popupimg.classList.add('img-popup-cross');
    //         }
    //     }
    // }
    // checker();

    const handleVote = async (event) => {
        const { contract } = state;
        const { accounts } = state;

        if (!contract) {
            return;
        }
        const currentAccount = accounts[0];

        if (selectedCandidate) {
            const votingEndTime = await contract.methods.getVotingEndTime().call();
            if (votingEndTime < Date.now()/1000){
                alert("Voting Session is closed!")
            } else{
                const isVoterIdValid = await contract.methods.checkIfVoterIdExists(voterId).send({ from: currentAccount });
                console.log("isVoterIdValid", isVoterIdValid)
                if(!isVoterIdValid){
                    alert("Please Enter a valid voter ID");
                }
                else{
                    const transaction = await contract.methods.vote(selectedCandidate, voterId).send({ from: currentAccount });
                    console.log('Transaction is done:', transaction);
                    const popuph2 = document.querySelector('.popup-h2');
                    const popupP = document.querySelector('.popup-p');
                    const popupimg = document.querySelector('.img-popup');
                    if (popupimg) {
                        popupimg.classList.add('img-popup-tick');
                    }
                    popuph2.innerHTML = "Congratulations!"
                    popupP.innerHTML = "Your Vote is Submitted!"
                }
            }
        } else {
            console.log("No Candidate Selected, Caller: HandleVote")
        }
    };

    return (
        <>
        <CandidatesData saveCandidates={saveCandidates}/>
            <div className="body11">
                <div className="text_input_container">
                    <h3 className="input_label">VoterID:</h3>
                    <input 
                        type="text" 
                        id="voterIdInput" 
                        className="custom-input"
                        placeholder="Enter your VoterID" 
                        value={voterId}
                        onChange={(e) => setVoterId(e.target.value)}
                    />
                </div>
                <select
                    id="candidatesDropdown"
                    name="candidatesDropdown"
                    value={selectedCandidate}
                    onChange={handleSelectChange} >
                    <option value="" selected class="selected">Select a candidate</option>
                    {candidates.map((candidate) => (
                        <option key={candidate.id} value={candidate.id}>
                            {candidate.name}
                        </option>
                    ))}
                </select>
                <button className="VoteBtn" onClick={openPopup}>VOTE</button>
                <div className="container1">
                    <div className="popup">
                        <img className="img-popup" />
                        <h2 className="popup-h2">Please Wait!</h2>
                        <p className="popup-p">Your Transaction is in progress!</p>
                        <button type="submit" class="btn" onClick={closePopup}>Close</button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Vote;