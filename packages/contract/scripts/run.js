const hre = require('hardhat');

const main = async () => {
  const [owner, superCoder] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy('ninja');
  await domainContract.deployed();

  console.log('Contract owner:', owner.address);

  // 今回は多額を設定しています。
  let txn = await domainContract.register('a16z', {
    value: hre.ethers.utils.parseEther('1234'),
  });
  await txn.wait();

  // コントラクトにいくらあるかを確認しています。
  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(balance));

  // スーパーコーダーとしてコントラクトから資金を奪おうとします。
  try {
    txn = await domainContract.connect(superCoder).withdraw();
    await txn.wait();
  } catch (error) {
    console.log('Could not rob contract');
  }

  // 引き出し前のウォレットの残高を確認します。あとで比較します。
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    'Balance of owner before withdrawal:',
    hre.ethers.utils.formatEther(ownerBalance),
  );

  // オーナーなら引き出せるでしょう。
  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();

  // contract と owner の残高を確認します。
  const contractBalance = await hre.ethers.provider.getBalance(
    domainContract.address,
  );
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log(
    'Contract balance after withdrawal:',
    hre.ethers.utils.formatEther(contractBalance),
  );
  console.log(
    'Balance of owner after withdrawal:',
    hre.ethers.utils.formatEther(ownerBalance),
  );
};

const runMain = async () => {
  try {
    await main();
  } catch (error) {
    console.log(error);
  }
};

runMain();
