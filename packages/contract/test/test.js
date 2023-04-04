const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const hre = require('hardhat');
const { expect } = require('chai');

describe('ENS-Domain', () => {

    // デプロイ＋ドメインの登録までを行う関数
    async function deployTextFixture() {
        const [owner, superCoder] = await hre.ethers.getSigners();
        const domainContractFactory = await hre.ethers.getContractFactory('Domains');
        const domainContract = await domainContractFactory.deploy('ninja');
        await domainContract.deployed();

        let txn = await domainContract.register('abc', {
            value: hre.ethers.utils.parseEther('1234'),
        });
        await txn.wait();

        txn = await domainContract.register('defg', {
            value: hre.ethers.utils.parseEther('2000'),
        });

        return {
            owner,
            superCoder,
            domainContract
        }
    }

    // コントラクトが所有するトークンの総量を確認
    it('Token amount contract has is correct!', async () => {
        const { domainContract } = await loadFixture(
            deployTextFixture,
        );

        // コントラクトにいくらあるかを確認しています。
        const balance = await hre.ethers.provider.getBalance(domainContract.address);
        expect(hre.ethers.utils.formatEther(balance)).to.equal('3234.0');
    });

    // オーナー以外はコントラクトからトークンを引き出せないか確認
    it('someone not owenr cannot withdraw token', async () => {
        const { owner, superCoder, domainContract } = await loadFixture(
            deployTextFixture,
        );

        let txn

        const ownerBeforeBalance = await hre.ethers.provider.getBalance(owner.address);
        // スーパーコーダーとしてコントラクトから資金を奪おうとします。
        try {
            txn = await domainContract.connect(superCoder).withdraw();
            await txn.wait();
        } catch (error) {
            console.log("robber could not withdraw token");
        }

        const ownerAfterBalance = await hre.ethers.provider.getBalance(owner.address);
        expect(ownerBeforeBalance).to.equal(ownerAfterBalance);
    });

    // コントラクトのオーナーはコントラクトからトークンを引き出せることを確認
    it('Token amount contract has is correct!', async () => {
        const { owner, domainContract } = await loadFixture(
            deployTextFixture,
        );

        const ownerBeforeBalance = await hre.ethers.provider.getBalance(owner.address);

        // オーナーなら引き出せるでしょう。
        const txn = await domainContract.connect(owner).withdraw();
        await txn.wait();

        const ownerAfterBalance = await hre.ethers.provider.getBalance(owner.address);
        console.log(
            'owner balance before withdrawal:',
            hre.ethers.utils.formatEther(ownerBeforeBalance),
        );

        expect(hre.ethers.utils.formatEther(ownerAfterBalance)).to.not.equal(3233.999949023202);
    });

    // ドメインの長さによって価格が変化することを確認
    it('Domain value is depend on how long it is', async () => {
        const { owner, domainContract } = await loadFixture(
            deployTextFixture,
        );

        const price1 = await domainContract.price("abc");
        const price2 = await domainContract.price("defg");

        expect(hre.ethers.utils.formatEther(price1)).to.not.equal(hre.ethers.utils.formatEther(price2));
    });
});