<script lang="ts">
    import {
        provideVSCodeDesignSystem,
        vsCodeButton,
        vsCodeDropdown,
        vsCodeOption,
        vsCodeDivider,
        vsCodeCheckbox,
        vsCodeTextField
    } from '@vscode/webview-ui-toolkit';
    import Contract from '../../components/Contract.svelte';
    import Divider from '../../components/Divider.svelte';
    import CallSetup from '../../components/CallSetup.svelte';
    import {
        StateId,
        WebviewMessage,
        type CallPayload,
        type WakeCallRequestParams,
        type ContractFunction as ContractFunctionType
    } from '../../../shared/types';
    import { onMount } from 'svelte';
    import { messageHandler } from '@estruyf/vscode/dist/client';
    // import '../../../shared/types'; // Importing types to avoid TS error

    provideVSCodeDesignSystem().register(
        vsCodeButton(),
        vsCodeDropdown(),
        vsCodeOption(),
        vsCodeDivider(),
        vsCodeCheckbox(),
        vsCodeTextField()
    );

    let deployedContracts: Array<any> = [];
    let callSetup: CallSetup;

    onMount(() => {
        messageHandler.send(WebviewMessage.getState, StateId.DeployedContracts);
    });

    window.addEventListener('message', (event) => {
        if (!event.data.command) return;

        const { command, payload, stateId } = event.data;

        switch (command) {
            case WebviewMessage.getState: {
                if (stateId === StateId.DeployedContracts) {
                    deployedContracts = payload;
                }

                break;
            }
        }
    });

    // @todo extract into a helper function
    const call = async function (
        calldata: string,
        contractAddress: string,
        func: ContractFunctionType
    ) {
        const _sender: string | undefined = callSetup.getSelectedAccount()?.address;
        if (_sender === undefined) {
            messageHandler.send(WebviewMessage.onError, 'Failed deployment, undefined sender');
            return;
        }

        const _value: number = callSetup.getValue() ?? 0;

        const requestParams: WakeCallRequestParams = {
            contractAddress: contractAddress,
            sender: _sender,
            calldata: calldata,
            // @dev automatically set value to 0 if function is not payable
            value: func.stateMutability === 'payable' ? _value : 0
        };

        const payload: CallPayload = {
            func: func,
            requestParams: requestParams
        };

        await messageHandler.send(WebviewMessage.onContractFunctionCall, payload);
    };
</script>

<main class="w-full">
    <CallSetup bind:this={callSetup} />

    <Divider />

    <section>
        <p class="mb-2">Deployed Contracts</p>
        {#each deployedContracts as contract, i}
            {#if i > 0}
                <Divider />
            {/if}
            <Contract {contract} onFunctionCall={call} />
        {/each}
    </section>
</main>

<style global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
