const { verify } = require("../utils/verify");
const { MIN_DELAY } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { log, deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const args = [MIN_DELAY, [], []];

  const timeLock = await deploy("TimeLock", {
    from: deployer,
    log: true,
    args: args,
  });
  log(`Contract deployed at ${timeLock.address}`);

  if (chainId != 31337) {
    await verify(timeLock.address, args);
    log("verified........");
  }
  log("------------------------------------");
};

module.exports.tags = ["all", "boxV2"];
