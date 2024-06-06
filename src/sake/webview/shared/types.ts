/*
*
* Account and Contract Interfaces
*
*/

export interface Account {
    address: string;
    balance: number;
}

// inherited from Fragment
export interface ContractFunction {
    // required
    inputs: Array<ContractFunctionInput>;
    stateMutability: string;
    type: string;

    // optional
    outputs: Array<any> | undefined; // TODO
    name: string;
    // displayName: string | undefined;
}

export type ContractAbi = Array<ContractFunction>;

export interface Contract extends Account {
    name: string;
    abi: ContractAbi;
}

// TODO rename to json interface (AbiFunctionFragment from web-eth-abi)
export interface ContractFunctionInput {
    // required
    internalType: string;
    name: string;
    type: string;

    // optional
    components: Array<ContractFunctionInput> | undefined;
}

/*
*
* Messaging
*
*/

export interface WebviewMessageData {
    command: string;
    payload: any;
    requestId?: string;
    stateId?: string;
}

// TODO resolve how svelte can import enums
// TODO should be STATE_ID but me no likey for some reason
// TODO add messages as enums
export enum WebviewMessage {
    onInfo = "onInfo",
    onError = "onError",
    getTextFromInputBox = "getTextFromInputBox",
    setState = "setState",
    getState = "getState",
    onCompile = "onCompile",
    onDeploy = "onDeploy",
    onContractFunctionCall = "onContractFunctionCall",
    onUndeployContract = "onUndeployContract", // TODO rename
    onGetAccounts = "onGetAccounts",
}

// TODO create pairs of WebviewMessage and WebviewInput and WebviewOutput

/*
*
* Payloads
*
*/

export interface FunctionCallPayload {
    contract: Contract;
    function: string;
    arguments: string;
}


export interface CompiledContract {
    fqn: string;
    name: string;
    abi: ContractAbi;
    // TODO join this type with contract
}

/*
*
* State
*
*/

// TODO remove this
export interface DeploymentStateData {
    name: string;
    address: string;
    abi: any;
}

export interface CompilationStateData {
    contracts: Array<CompiledContract>;
    dirty: boolean;
    // TODO add isDirty
}

export type AccountStateData = Array<string>; // TODO

export enum StateId {
    DeployedContracts = "deployedContracts",
    CompiledContracts = "compiledContracts",
    Accounts = "accounts",
}

/*
*
* API to Wake
*
*/

export interface WakeCompiledContract {
    [key: string]: ContractAbi
};

export interface TxReceipt {
    [key: string]: any
}

export interface WakeCompilationResponse {
    contracts: WakeCompiledContract;
    success: boolean;
    // TODO add error message
}

export interface WakeDeployedContract {
    type: string;
    status: string;
    cumulativeGasUsed: string;
    logs: any[];
    logsBloom: string;
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    blockNumber: string;
    gasUsed: string;
    effectiveGasPrice: string;
    from: string;
    to: string | null;
    contractAddress: string;
    root: string;
}

// export type WakeDeploymentResponse = WakeDeployedContract;
export interface WakeDeploymentResponse {
    success: boolean,
    contract_address: string | null,
    tx_receipt: TxReceipt,
    call_trace: string
}

export interface WakeDeploymentRequestParams {
    contract_fqn: string;
    sender: string;
    calldata: string;
    value: number;
}

export type WakeGetAccountsResponse = AccountStateData;

export interface WakeFunctionCallRequestParams {
    contract_address: string
    sender: string
    calldata: string
    value: number
}

export interface WakeFunctionCallResponse {
    success: boolean,
    return_value: string // might need to change to hex string
    tx_receipt: TxReceipt
    call_trace: string
}