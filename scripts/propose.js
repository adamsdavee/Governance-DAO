const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  VOTING_DELAY,
  proposalsFile,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-block");
const fs = require("fs");

async function propose(argss, functionToCall, proposalDescription) {
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  const args = [argss];
  const governance = await deployments.get("MyGovernor", deployer);
  const governanceContract = await ethers.getContractAt(
    "MyGovernor",
    governance.address
  );
  const boxx = await deployments.get("Box", deployer);
  const box = await ethers.getContractAt("Box", boxx.address);

  const encodedFunction = box.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(`Proposing ${functionToCall} on ${box.target} with ${args}`);
  console.log(`Proposal Description: \n ${proposalDescription}`);

  const proposeTx = await governanceContract.propose(
    [box.target],
    [0],
    [encodedFunction],
    proposalDescription
  );
  const proposalReceipt = await proposeTx.wait(1); // We do this to get the emitted events

  if (chainId == 31337) {
    await moveBlocks(VOTING_DELAY + 1);
  }
  const proposalId = proposalReceipt.logs[0].args.proposalId;
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  proposals[network.config.chainId.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
}

propose(NEW_STORE_VALUE, FUNC, PROPOSAL_DESCRIPTION).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// This is to create the stuff to vote about otherwise called the proposal
