const { verify } = require("../utils/verify");
const { ADDRESS_ZERO } = require("../helper-hardhat-config");
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { log, deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const governance = await deployments.get("MyGovernor", deployer);
  const governanceContract = await ethers.getContractAt(
    "MyGovernor",
    governance.address
  );
  const time = await deployments.get("TimeLock", deployer);
  const timeLock = await ethers.getContractAt("TimeLock", time.address);

  log("Setting up roles.....");

  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.DEFAULT_ADMIN_ROLE();

  const proposerTx = await timeLock.grantRole(
    proposerRole,
    governanceContract.target
  );

  await proposerTx.wait(1);

  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
  console.log("Cool");
  await executorTx.wait(1);

  // Revoke our role so we can't grant roles
  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(1);

  console.log("Roles has been set");
};

module.exports.tags = ["all", "setupGovernance"];
