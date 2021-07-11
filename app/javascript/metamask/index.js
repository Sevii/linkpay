/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/
import detectEthereumProvider from '@metamask/detect-provider';
import MetaMaskOnboarding from '@metamask/onboarding';
import BigNumber from "bignumber.js";
var currentAccount = {};


export async function walletCompatible() {
  console.log("wallet compatible!");
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
  console.log("No compatible wallet found!");
  return false;
}

export function onboard() {
  const onboarding = new MetaMaskOnboarding();
  onboarding.startOnboarding();
}

export async function pay(address, usdt_price, product_price) {
    
    let connectedResult = await ethereum.request({ method: 'eth_requestAccounts' })
    console.log("connectedResult");
    console.dir(connectedResult);
    currentAccount = connectedResult[0];

    if(address.length != 42) {
      new err("Invalid Address");
    }
    console.log("Pay method");
    console.log(address);
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
    let gweiValue = eth_amount_bn.times(new BigNumber("1000000000000000000")).integerValue();

    console.log("Amount in gwei: " + gweiValue.toFixed());

    // let weiValue = ethers.utils.parseEther(eth_amount_bn.toFixed());
    // console.log("wei value: " + weiValue);
    const transactionParameters = {
    nonce: '0x00', // ignored by MetaMask
    // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
    // gas: '0x2710', // customizable by user during MetaMask confirmation.
    to: address, // Required except during contract publications.
    from: ethereum.selectedAddress, // must match user's active address.
    value:  gweiValue.toString(16), // Amount of wei to send, must be in hex for large numbers
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
          currency_amount: gweiValue.toFixed()
        }

  console.log(orderPlaced);
  return orderPlaced;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

