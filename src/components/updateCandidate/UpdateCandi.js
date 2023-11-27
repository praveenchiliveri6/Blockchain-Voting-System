import { useState, useEffect } from "react";
import "./UpdateCandi.css"

const UpdateCandi = ({ state, refreshCandidateList, refreshEndTime }) => {

    const [input, setInput] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [votingEndTime, setVotingEndTime] = useState(null);

    const [candidateNameTextBox, setCandidateNameTextBox] = useState('');

    const saveCandidates = (arr) => {
        setCandidates(arr);
    }

    const { contract } = state;
    const { accounts } = state;

    useEffect(() => {
        const fetchVotingEndTime = async () => {
            if (!contract) return;
            const endTime = await contract.methods.getVotingEndTime().call();
            setVotingEndTime(endTime);
        };
        fetchVotingEndTime();
    }, [contract]);

    if (!contract) {
        return;
    }

    const openPopup = (message, isSuccess) => {
        const overlay = document.querySelector('.overlay');
        const popup = document.querySelector('.popup');
        const popuph2 = document.querySelector('.popup-h2');
        const popupP = document.querySelector('.popup-p');
        const popupimg = document.querySelector('.img-popup');
    
        if (isSuccess) {
            popupimg.classList.add('img-popup-tick');
        } else {
            popupimg.classList.add('img-popup-cross');
        }
    
        popuph2.innerHTML = message.title;
        popupP.innerHTML = message.body;
        
        if (overlay && popup) {
            overlay.style.display = 'block';
            popup.classList.add('open-popup');
        }

        if (popup) {
            popup.classList.add('open-popup');
        }
    };

    const closePopup = () => {
        const overlay = document.querySelector('.overlay');
        const popup = document.querySelector('.popup');
        if (overlay && popup) {
            overlay.style.display = 'none';
            popup.classList.remove('open-popup');
        }
    };

    const AddCandi = async () => {
        const currentAcc = await accounts[0];
        console.log(currentAcc);
        const admin = "0x76D81132eb074d4d2277fB10FdF14177fBFA7341";

        if (currentAcc !== admin) {
            openPopup({ title: "Access Denied", body: "Only Admin Can Add Candidates!" }, false);
        } else {

            const inputField = document.getElementById('textInput');
            const storedInput = await inputField.value;
            if (!storedInput) {
                return;
            }
            console.log(storedInput)
            const currentAccount = accounts[0];

            const transaction = await contract.methods.addCandidate(storedInput).send({ from: currentAccount });
            console.log('Transaction is done:', transaction);
            openPopup({ title: "Candidate Added", body: "The Candidate Is Added!" }, true);
            refreshCandidateList();
            setCandidateNameTextBox("")
            document.getElementById('textInput').value="";
        }
    }

    const updateEndTime = async () => {
        const inputField = document.getElementById('textInput2');
        const enteredTime = inputField.value;
        const enteredTimeInEpoch = Math.floor(new Date(enteredTime).getTime()/1000);
        const transac = await contract.methods.startNewPoll(enteredTimeInEpoch).send({ from: accounts[0] });
        console.log("Transaction to update end time is done:", transac)
        setVotingEndTime(enteredTimeInEpoch)
        refreshCandidateList()
        refreshEndTime();
    }

    return (
        <>
            {console.log("votingEndTime", votingEndTime, Date.now()/1000)}
            {
                (votingEndTime < Date.now()/1000) ? 
                    <div className="input-button-container">
                        <div className="text_btn">
                            <h3 className="h3">Set the End Time for the Election</h3>
                            <input type="datetime-local" id="textInput2" className="custom-input" />
                            <button onClick={updateEndTime} className="custom-button">Start Election</button>
                        </div>
                    </div> :
                    <div className="input-button-container">
                        <div className="text_btn">
                            <h3 className="h3">Add Candidate!</h3>
                            <input type="text" id="textInput" className="custom-input" value={candidateNameTextBox} onChange={(e) => setCandidateNameTextBox(e.target.value)}/>
                            <button onClick={AddCandi} className="custom-button">Click to Store</button>
                        </div>
                    </div>
            }   

            <div className="container1">
                <div className="overlay" onClick={closePopup}></div>
                <div className="popup">
                    <img className="img-popup" />
                    <h2 className="popup-h2">Please Wait!</h2>
                    <p className="popup-p">Your transaction is in progress!</p>
                    <button type="submit" className="btn" onClick={closePopup}>Close</button>
                </div>
            </div>

        </>
    );
}

export default UpdateCandi;
