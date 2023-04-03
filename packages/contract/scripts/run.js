const hre = require('hardhat');

const main = async () => {
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    // "ninja"をデプロイ時にconstructorに渡します。
    const domainContract = await domainContractFactory.deploy("ninja");
    await domainContract.deployed();

    console.log("Contract deployed to:", domainContract.address);

    // valueで代金をやりとりしています。
    const txn = await domainContract.register("mortal", {
        value: hre.ethers.utils.parseEther("0.01"),
    });
    await txn.wait();

    const address = await domainContract.getAddress("mortal");
    console.log("Owner of domain mortal:", address);

    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
    try {
        await main();
    } catch (error) {
        console.log(error);
    }
};

runMain();