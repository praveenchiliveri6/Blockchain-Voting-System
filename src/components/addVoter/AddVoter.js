import { useState, useEffect } from "react";
import "./AddVoter.css"
import Wallet from "../Wallet/Wallet";

const AddVoter = () => {

    const [state, setState] = useState({
        web: null,
        contract: null,
        accounts: null
    })
    const saveState = (state) => {
        setState(state);
    }


    const addVoter = async () => {
        const inputField = document.getElementById('textInput');
        const voterId = await inputField.value;
        const inputField2 = document.getElementById('textInput2');
        const metamaskId = await inputField2.value;

        const { contract, accounts } = state
        if (!contract) {
            return;
        }
        const transaction = await contract.methods.registerVoter(voterId, metamaskId).send({ from: accounts[0] });
        console.log("Voter Registered", transaction)
    }

    return (
        <>
            <Wallet saveState={saveState} />

            <div className="input-button-container-addVoter">
                <div className="text_btn-addVoter">
                    <h3 className="h3">Register a Voter!</h3>
                    <input type="text" id="textInput" className="custom-input-addVoter" placeholder="Enter Voter ID"/>
                    <input type="text" id="textInput2" className="custom-input-addVoter" placeholder="Enter Metamask ID"/>
                    <button onClick={addVoter} className="custom-button-addVoter">Click to Register</button>
                </div>
            </div>
        </>
    );
}

export default AddVoter;
