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

require('it-each')({ testPerIteration: true });
const { Universal, MemoryAccount, Node } = require('@aeternity/aepp-sdk');
const BONDING_CURVE_LINEAR_CONTRACT = utils.readFileRelative(
  './contracts/BondCurveLinear.aes',
  'utf-8',
);
const testData = require('./data');

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
    contract = await client.getContractInstance(BONDING_CURVE_LINEAR_CONTRACT);
    const init = await contract.methods.init();
    assert.equal(init.result.returnType, 'ok');
  });

  describe('Buy current price tests', () => {
    it.each(
      [...testData],
      'Should get buy price for supply %s',
      ['element'],
      (p, next) => {
        contract.methods.buy_price(p.totalSupply).then((result) => {
          assert.equal(
            result.decodedResult,
            p.totalSupply + 1,
            `Buy price incorrect for supply: ${p.totalSupply}`,
          );
          next();
        });
      },
    );
  });

  describe('Sell current price tests', () => {
    it.each(
      [...testData],
      'Should get sell price for supply %s',
      ['element'],
      (p, next) => {
        contract.methods.sell_price(p.totalSupply).then((result) => {
          assert.equal(
            result.decodedResult,
            p.totalSupply,
            `Sell price incorrect for supply: ${p.totalSupply}`,
          );
          next();
        });
      },
    );
  });

  describe('Calculate Buy price tests', () => {
    it.each(
      [...testData],
      'Should calculate buy price for supply %s',
      ['element'],
      (p, next) => {
        contract.methods
          .calculate_buy_price(p.totalSupply, p.buy.amount)
          .then((result) => {
            assert.equal(
              result.decodedResult,
              p.buy.aettos,
              `Calculation for buy price incorrect for: supply=${p.totalSupply} buy_amount=${p.buy.amount}`,
            );
            next();
          });
      },
    );
  });

  describe('Sell price tests', () => {
    it.each(
      [...testData],
      'Should calculate sell return for supply %s',
      ['element'],
      (p, next) => {
        if (p.totalSupply >= p.sell.amount) {
          contract.methods
            .calculate_sell_return(p.totalSupply, p.sell.amount)
            .then((result) => {
              assert.equal(
                result.decodedResult,
                p.sell.aettos,
                `Calculation for sell price incorrect for: supply=${p.totalSupply} sell_amount=${p.sell.amount}`,
              );
              next();
            });
        } else {
          contract.methods
            .calculate_sell_return(p.totalSupply, p.sell.amount)
            .then((result) => {
              assert.equal(
                result.decodedResult,
                p.sell.aettos,
                `Calculation for sell price incorrect for: supply=${p.totalSupply} sell_amount=${p.sell.amount}`,
              );
              next();
            })
            .catch((e) => {
              if (
                e.decodedError.indexOf(
                  'ERROR_SELL_INSUFFICIENT_TOTAL_SUPPLY' > -1,
                )
              ) {
                next();
              }
            });
        }
      },
    );
  });
});
