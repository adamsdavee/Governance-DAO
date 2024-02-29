const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
  MIN_DELAY,
} = require("../helper-hardhat-config");
const { moveTime } = require("../utils/move-time");
const { moveBlocks } = require("../utils/move-block");

async function queueAndExecute() {
  const { deployer } = await getNamedAccounts();
  const args = [NEW_STORE_VALUE];
  const boxx = await deployments.get("Box", deployer);
  const box = await ethers.getContractAt("Box", boxx.address);
  const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
  const descriptionHash = ethers.keccak256(
    ethers.toUtf8Bytes(PROPOSAL_DESCRIPTION)
  );
  const governance = await deployments.get("MyGovernor", deployer);
  const governanceContract = await ethers.getContractAt(
    "MyGovernor",
    governance.address
  );

  console.log("Queueing....");
  const queueTx = await governanceContract.queue(
    [box.target],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await queueTx.wait(1);

  if (network.config.chainId == 31337) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log("Executing...");
  const executeTx = await governanceContract.execute(
    [box.target],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);

  const boxNewValue = await box.retrieve();
  console.log(`New Box Value: ${boxNewValue.toString()}`);
}

queueAndExecute().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
