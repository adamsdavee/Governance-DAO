const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { log, deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const GovernanceToken = await deploy("GovernanceToken", {
    from: deployer,
    log: true,
    args: [],
  });
  log(`Contract deployed at ${GovernanceToken.address}`);

  if (chainId != 31337) {
    await verify(GovernanceToken.address, []);
    log("verified........");
  }
  log("------------------------------------");

  await delegate(GovernanceToken.address, deployer);
  log("Delegated!");
};

async function delegate(governanceAddress, delegatedAccount) {
  const contract = await ethers.getContractAt(
    "GovernanceToken",
    governanceAddress
  );
  const delegateTx = await contract.delegate(delegatedAccount);
  await delegateTx.wait(1);

  console.log(`Checkpoints ${await contract.numCheckpoints(delegatedAccount)}`);
}

module.exports.tags = ["all", "GovernorToken"];
