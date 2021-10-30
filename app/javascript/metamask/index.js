/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/
import detectEthereumProvider from '@metamask/detect-provider';
import MetaMaskOnboarding from '@metamask/onboarding';
import BigNumber from "bignumber.js";


import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import qs from "qs";

var currentAccount = "";
var walletConnectProvider = null;

export async function walletCompatible() {

  let metamaskInstalled = MetaMaskOnboarding.isMetaMaskInstalled();
  if(metamaskInstalled) {
    console.log("Metamask installed!");
    return true;
  }

  let eth_provider = await detectEthereumProvider();
  if(eth_provider != null && eth_provider == window.ethereum) {
    console.log("Eth wallet avaliable!");
    return true;
  }

  //Wallet connect
  walletConnectProvider = await walletConnect();
  if(walletConnectProvider != null) {
    console.log("WalletConnected");
    return true;
  }


  console.log("No compatible wallet found!");
  return false;
}

async function walletConnect() {
  let storedWalletConnectJSON = await window.localStorage.getItem("walletconnect");
  let storedWalletConnect = JSON.parse(storedWalletConnectJSON);
  console.log(storedWalletConnect);

  if(storedWalletConnect != null && (typeof storedWalletConnect !== 'undefined')) {
    console.log("Found a stored wallet connect");
    console.log("Accounts: + " + storedWalletConnect.accounts);
    currentAccount = storedWalletConnect.accounts[0];
  }

  // Create a connector
  const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
  });

  // Check if connection is already established
  if (!connector.connected) {
    // create new session
    connector.createSession();
  }

  // Subscribe to connection events
  connector.on("connect", (error, payload) => {
    if (error) {
      throw error;
    }

    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    currentAccount = accounts[0];
  });

  connector.on("session_update", (error, payload) => {
    if (error) {
      throw error;
    }

    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    currentAccount = accounts[0];
  });

  connector.on("disconnect", (error, payload) => {
    if (error) {
      throw error;
    }

    // Delete connector
    connector = null;
  });
  return connector;
}

export function onboard() {
  const onboarding = new MetaMaskOnboarding();
  onboarding.startOnboarding();
}

async function payWalletConnect(toAddress, gweiAmount, usdt_price_bn) {
  let fromAddress = currentAccount;
  console.log("FromAddress: " + fromAddress);
  const tx = {
    from: fromAddress, // Required
    to: toAddress, // Required (for non contract deployments)
    data: "0x", // Required
    value: gweiAmount.toString(16), // Optional
    nonce: "0x00", // Optional
  };


  let txHash = await walletConnectProvider.sendTransaction(tx);
  console.log(txHash);

  let orderPlaced = {
          transaction_hash: txHash,
          currency_to_usd: usdt_price_bn.integerValue(),
          currency_amount: gweiAmount.toFixed(),
          customer_account: fromAddress
        }

  console.log(orderPlaced);
  return orderPlaced;
}

async function payMetamask(toAddress, gweiAmount, usdt_price_bn) {
  let connectedResult = await ethereum.request({ method: 'eth_requestAccounts' })
  console.log("connectedResult");
  console.dir(connectedResult);
  currentAccount = connectedResult[0];
  let fromAddress = ethereum.selectedAddress;
  console.log("FromAddress: " + fromAddress);
  // let weiValue = ethers.utils.parseEther(eth_amount_bn.toFixed());
  // console.log("wei value: " + weiValue);
  const transactionParameters = {
    nonce: '0x00', // ignored by MetaMask
    // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
    // gas: '0x2710', // customizable by user during MetaMask confirmation.
    to: toAddress, // Required except during contract publications.
    from: fromAddress, // must match user's active address.
    value:  gweiAmount.toString(16), // Amount of wei to send, must be in hex for large numbers
    data: '', // Optional, but used for defining smart contract creation and interaction.
    chainId: '0x1', // 0x3 is Ropstein test network Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };

  console.log(transactionParameters);
  // txHash is a hex string
  // As with any RPC call, it may throw an error
  const txHash = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });

  let orderPlaced = {
          transaction_hash: txHash,
          currency_to_usd: usdt_price_bn.integerValue(),
          currency_amount: gweiAmount.toFixed(),
          customer_account: fromAddress
        }

  console.log(orderPlaced);
  return orderPlaced;

}

export async function pay(toAddress, usdt_price, product_price) {
    if(toAddress.length != 42) {
      new err("Invalid Address");
    }
    console.log("Pay method");
    console.log(toAddress);
    console.log("Eth/usdt: " + usdt_price);
    //2625.31000000

    let usdt_price_bn = new BigNumber(usdt_price * 100);

    console.log(usdt_price_bn.toFixed());

    let product_price_bn = new BigNumber(product_price);
    console.log(product_price_bn.toFixed());

    let eth_amount_bn = product_price_bn.div(usdt_price_bn);

    console.log("eth_amount: " + eth_amount_bn.toFixed());
    console.log("usdt_price_bn: " + usdt_price_bn.toFixed());
    console.log("product_price_bn: " + product_price_bn.toFixed());

  

    let currencyValue = eth_amount_bn.toFixed(); 
    console.log("Amount in eth: " + currencyValue);

    // Convert eth fraction to wei 1ETH = 10^18 wei 
    // gwei cannot be fractional so we convert to an integer
    let gweiAmount = eth_amount_bn.times(new BigNumber("1000000000000000000")).integerValue();

    console.log("Amount in gwei: " + gweiAmount.toFixed());

    if(walletConnectProvider != null) {
      return payWalletConnect(toAddress, gweiAmount, usdt_price_bn);
    } else {
      return payMetamask(toAddress, gweiAmount, usdt_price_bn);
    }
}

function encode (address, options, urnScheme) {
  options = options || {}
  var scheme = urnScheme || 'bitcoin'
  var query = qs.stringify(options)

  if (options.amount) {
    if (!isFinite(options.amount)) throw new TypeError('Invalid amount')
    if (options.amount < 0) throw new TypeError('Invalid amount')
  }

  return scheme + ':' + address + (query ? '?' : '') + query
}


export async function pay_bitcoin_qr(toAddress, usdt_price, product_price)  {
  let usdt_price_bn = new BigNumber(usdt_price * 100);

    console.log(usdt_price_bn.toFixed());

    let product_price_bn = new BigNumber(product_price);
    console.log(product_price_bn.toFixed());

    let btc_amount_bn = product_price_bn.div(usdt_price_bn);

    console.log("btc_amount: " + btc_amount_bn.toFixed());
    console.log("usdt_price_bn: " + usdt_price_bn.toFixed());
    console.log("product_price_bn: " + product_price_bn.toFixed());
    let currencyValue = btc_amount_bn.toFixed(); 
    console.log("Amount in btc: " + currencyValue);
  

  //amount must be in decimal format BTC unlike eth which is in wei.
  let options = {
    amount:  currencyValue,
    label: "this is a label",
    message: "seviipay" + getRandomArbitrary(1,100)
  }

  console.log(options);

  let url = encode(toAddress, options, null);
  console.log(url);

  return url;

}



function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}




















