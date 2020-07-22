/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */

const { Universal, MemoryAccount, Node } = require('@aeternity/aepp-sdk');
const BONDING_CURVE_CONTRACT = utils.readFileRelative(
  './contracts/Bond.aes',
  'utf-8',
);

const config = {
  url: 'http://localhost:3001/',
  internalUrl: 'http://localhost:3001/',
  compilerUrl: 'http://localhost:3080',
};

describe('Bonding Curve Contract', () => {
  let client, contract;

  before(async () => {
    client = await Universal({
      nodes: [
        {
          name: 'devnetNode',
          instance: await Node(config),
        },
      ],
      accounts: [
        MemoryAccount({
          keypair: wallets[0],
        }),
      ],
      networkId: 'ae_devnet',
      compilerUrl: config.compilerUrl,
    });
  });

  it('Deploying Bond Contract', async () => {
    contract = await client.getContractInstance(BONDING_CURVE_CONTRACT);
    const init = await contract.methods.init();
    assert.equal(init.result.returnType, 'ok');
  });


//   it('Bonding Curve Contract Spend Successful', async () => {
//     const receiverBalanceInitial = await owner.balance(receiverPublicKey);

//     let res;

//     res = await contract.call('buy', [], { amount: 1000 });
//     console.log(await res.decode());

//     res = await contract.call('buy', [], { amount: 1000 });
//     console.log(await res.decode());

//     res = await contract.call('my_balance_pretty', [], { amount: 0 });
//     console.log(await res.decode());

//     res = await contract.call('sell', [7], { amount: 0 });
//     console.log(await res.decode());

//     res = await contract.call('sell', [1], { amount: 0 });
//     console.log(await res.decode());

//     res = await contract.call('my_balance_pretty', [], { amount: 0 });
//     console.log(await res.decode());

//     //const receiverBalanceAfterwards = await owner.balance(receiverPublicKey);
//     //assert.equal(parseInt(receiverBalanceInitial) + 1000, parseInt(receiverBalanceAfterwards)); // don't use parseInt, use a library like bignumber.js
//   });
});
