import { ethers } from 'ethers';
import TokenStreamingABI from './abi/TokenStreaming.json';

export interface Timeframe {
  startBlock: bigint;
  endBlock: bigint;
}

export interface Stream {
  sender: string;
  recipient: string;
  token: string;
  balance: bigint;
  timeframe: Timeframe;
  paymentPerBlock: bigint;
  withdrawnAmount: bigint;
  settledAmount: bigint;
  isActive: boolean;
}

export const STREAMING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STREAMING_CONTRACT_ADDRESS || '';

export const getStreamingContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(STREAMING_CONTRACT_ADDRESS, TokenStreamingABI, providerOrSigner);
};

export const createStream = async (
  recipient: string,
  token: string,
  initialBalance: bigint,
  timeframe: Timeframe,
  paymentPerBlock: bigint,
  signer: ethers.Signer
) => {
  const contract = getStreamingContract(signer);
  const isEth = token === ethers.ZeroAddress;
  
  const tx = await contract.createStream(
    recipient,
    token,
    initialBalance,
    [timeframe.startBlock, timeframe.endBlock],
    paymentPerBlock,
    { value: isEth ? initialBalance : 0 }
  );
  return tx;
};

export const refuel = async (streamId: bigint, amount: bigint, token: string, signer: ethers.Signer) => {
  const contract = getStreamingContract(signer);
  const isEth = token === ethers.ZeroAddress;
  
  const tx = await contract.refuel(streamId, amount, {
    value: isEth ? amount : 0
  });
  return tx;
};

export const withdraw = async (streamId: bigint, signer: ethers.Signer) => {
  const contract = getStreamingContract(signer);
  const tx = await contract.withdraw(streamId);
  return tx;
};

export const refund = async (streamId: bigint, signer: ethers.Signer) => {
  const contract = getStreamingContract(signer);
  const tx = await contract.refund(streamId);
  return tx;
};

export const getStream = async (streamId: bigint, provider: ethers.Provider): Promise<Stream> => {
  const contract = getStreamingContract(provider);
  const data = await contract.getStream(streamId);
  return {
    sender: data.sender,
    recipient: data.recipient,
    token: data.token,
    balance: data.balance,
    timeframe: {
      startBlock: data.timeframe.startBlock,
      endBlock: data.timeframe.endBlock,
    },
    paymentPerBlock: data.paymentPerBlock,
    withdrawnAmount: data.withdrawnAmount,
    settledAmount: data.settledAmount,
    isActive: data.isActive,
  };
};

export const getWithdrawableBalance = async (streamId: bigint, account: string, provider: ethers.Provider): Promise<bigint> => {
  const contract = getStreamingContract(provider);
  return await contract.getWithdrawableBalance(streamId, account);
};

export const hashStream = async (
  streamId: bigint,
  newPaymentPerBlock: bigint,
  newTimeframe: Timeframe,
  provider: ethers.Provider
): Promise<string> => {
  const contract = getStreamingContract(provider);
  return await contract.hashStream(streamId, newPaymentPerBlock, [newTimeframe.startBlock, newTimeframe.endBlock]);
};

export const updateStreamDetails = async (
  streamId: bigint,
  newPaymentPerBlock: bigint,
  newTimeframe: Timeframe,
  signature: string,
  signer: ethers.Signer
) => {
  const contract = getStreamingContract(signer);
  const tx = await contract.updateStreamDetails(
    streamId,
    newPaymentPerBlock,
    [newTimeframe.startBlock, newTimeframe.endBlock],
    signature
  );
  return tx;
};

export const getAllStreams = async (provider: ethers.Provider) => {
  const contract = getStreamingContract(provider);
  const filter = contract.filters.StreamCreated();
  const events = await contract.queryFilter(filter);
  return events.map(event => {
    const args = (event as any).args;
    return {
      streamId: args.streamId,
      sender: args.sender,
      recipient: args.recipient,
      token: args.token,
      amount: args.amount,
      transactionHash: event.transactionHash
    };
  });
};
