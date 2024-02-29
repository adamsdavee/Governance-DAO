const { verify } = require("../utils/verify");
const {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { log, deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const governanceToken = await deployments.get("GovernanceToken", deployer);
  const timeLock = await deployments.get("TimeLock", deployer);
  console.log(governanceToken.address);

  const args = [
    governanceToken.address,
    timeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];

  const governanceContract = await deploy("MyGovernor", {
    from: deployer,
    log: true,
    args: args,
  });
  log(`Contract deployed at ${governanceContract.address}`);

  if (chainId != 31337) {
    await verify(governanceContract.address, args);
    log("verified........");
  }
  log("------------------------------------");
};

module.exports.tags = ["all", "boxV2"];
