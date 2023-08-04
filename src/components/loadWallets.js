import React, { useEffect, useState } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { StacksTestnet, StacksMainnet } from "@stacks/network";

function WalletConnect() {
  const [address, setAddress] = React.useState([]);
  const [ordinalAddress, setOrdinalAddress] = React.useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const [msg, setMsg] = React.useState([]);
  const [addr, setAddr] = React.useState([]);
  const [amount, setAmount] = React.useState([]);
  const [tx, setTx] = React.useState(null);
  const appConfig = new AppConfig();
  const userSession = new UserSession({ appConfig });
  var resolve = function (cardinalAddress, ordinalAddress) {
    setOrdinalAddress(ordinalAddress);
    setAddress(cardinalAddress);
  };
  useEffect(() => {
    console.log(window.HiroWalletProvider);
    setTimeout(async () => {
      if (!window.HiroWalletProvider) {
        setMsg("Please install Hiro wallet");
        setDisabled(true);
      } else {
        setMsg("");
        if (!userSession.isUserSignedIn()) {
          showConnect({
            userSession,
            network: StacksMainnet,
            appDetails: {
              name: "Ordinal Marketplace",

              icon: window.location.origin + "/app-icon.png",
            },
            onFinish: () => {
              resolve(
                userSession.loadUserData().profile.btcAddress.p2wpkh.mainnet,
                userSession.loadUserData().profile.btcAddress.p2tr.mainnet
              );
              document.getElementById("walletBtn").innerText =
                "Wallect Connected";
              document.getElementById("walletBtn").disabled = true;
            },
            onCancel: () => {
              alert("Canceled");
            },
          });
        } else {
          setAddress(
            userSession.loadUserData().profile.btcAddress.p2wpkh.mainnet
          );
          setOrdinalAddress(
            userSession.loadUserData().profile.btcAddress.p2tr.mainnet
          );
          document.getElementById("walletBtn").innerText = "Wallect Connected";
          document.getElementById("walletBtn").disabled = true;
        }
      }
    }, 50);
  }, []);
  async function handleSigning() {
    const response = await window.btc.request("signMessage", {
      message: "Sign the message can be related to anything!!",
      paymentType: "p2tr", // or 'p2wphk' (default)
    });
    console.log(response.result.signature);
  }
  async function handleSubmit() {
    try {
      const resp = await window.btc?.request("sendTransfer", {
        address: addr,
        amount: amount,
      });
      setTx(resp.result.txid);
    } catch (e) {
      alert("Transaction Canceled");
    }
  }

  return (
    <div>
      <h2>{msg}</h2>
      <button type="button" disabled={isDisabled} id="walletBtn">
        Connect Wallet
      </button>
      {address && ordinalAddress ? (
        <div>
          <p>Cordinal Address: {address} </p>
          <p>Ordinal Address: {ordinalAddress}</p>
          <div>
            <label for="address">Address:</label>
            <input
              type="text"
              name="address"
              id="address"
              onChange={(event) => setAddr(event.target.value)}
            ></input>
            <br />
            <label for="amount">Amount(SAT):</label>
            <input
              type="text"
              name="amount"
              id="amount"
              onChange={(event) => setAmount(event.target.value)}
            ></input>
            <br />
            <button onClick={handleSubmit}>Transfer</button>
            <br />
            <button onClick={handleSigning}>Sign Transaction</button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {tx != null ? <div> TXID: {tx}</div> : <div></div>}
    </div>
  );
}

export default WalletConnect;
