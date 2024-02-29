const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { proposalsFile, VOTING_PERIOD } = require("../helper-hardhat-config");
const fs = require("fs");
const { moveBlocks } = require("../utils/move-block");

const index = 0;

async function vote(proposalIndex) {
  const { deployer } = await getNamedAccounts();
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const proposalId = proposals[network.config.chainId][proposalIndex];
  // 0 = Against, 1 = For, 2 = Abstain;
  const voteWay = 1;
  const governance = await deployments.get("MyGovernor", deployer);
  const governanceContract = await ethers.getContractAt(
    "MyGovernor",
    governance.address
  );
  const reason = "I like a do da cha cha";
  const voteTxResponse = await governanceContract.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);
  if (network.config.chainId == 31337) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("Voted! Ready to go!");
  const state = await governanceContract.state(proposalId);
  console.log(state); // 4 means succeeded and it is an enum on the IGovernor contract and these happened
  // because i moved forward some blocks on the local chain and the voting period expired. Without moving
  // those blocks the proposal would still be active which means another person can vote
}

vote(index).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
